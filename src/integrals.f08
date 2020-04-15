module integrals
  !! module for computing integrals
  implicit none
contains

  function trapz(x,y) result(Int)
    !! Aproximates the integral of the function
    !! $$ y = f(x)$$
    !! given a set of points:
    !! $$(x_i,y_i)$$
    !! using the trapezoidal rule.
    !! The points do not need to be linearly spaced along the
    !! integration domain.
    real, intent(in) :: x(0:)
    !! Array containing the abscissas of the points
    real, intent(in) :: y(0:)
    !! Array containing the ordinates of the points
    real :: Int
    !! Numerical aproximation to the integral

    integer :: i, N

    N = ubound(x,1)
    Int = 0.
    do i = 1,N
      Int = Int + (y(i-1)+y(i))/2*(x(i)-x(i-1))
    end do
  end function




  function quad_trapz(f,a,b,h_in) result(Int)
    !! Approximates the integral:
    !! $$ \int_{a}^{b}f\left(x\right)\,\mathrm{d}x$$
    !! using the trapezoidal rule on a linearly spaced
    !! set of points.
    interface
      function f(x) result(y)
        !! Function to be integrated
        real, intent(in) :: x
        !! independent variable
        real :: y
        !! dependent variable
      end function
    end interface
    real, intent(in) :: a
    !! Lower limit of integration
    real, intent(in) :: b
    !! Upper limit of integration
    real, intent(in) :: h_in
    !! Approximated size of the intervals used by the trapezoidal rule.
    real :: Int
    !! Numerical approximation to the integral

    integer :: i, N
    real :: h, x_l, x_r

    ! imposing that h must divide (b-a) in a whole number
    ! of intervals
    N = ceiling((b-a)/h_in)
    h = (b-a)/N

    Int = 0.
    do i=1,N
      x_l = (i-1)*h
      x_r = i*h
      Int = Int + (f(x_l)+f(x_r))/2
    end do
    Int = Int*h
  end function


function quad_simpson(f,a,b,h_in) result(Int)
  !! Approximates the integral:
  !! $$ \int_{a}^{b}f\left(x\right)\,\mathrm{d}x$$
  !! using Simpson's rule on a linearly spaced
  !! set of points.
  interface
    function f(x) result(y)
      !! Function to be integrated
      real, intent(in) :: x
      !! independent variable
      real :: y
      !! dependent variable
    end function
  end interface
  real, intent(in) :: a
  !! Lower limit of integration
  real, intent(in) :: b
  !! Upper limit of integration
  real, intent(in) :: h_in
  !! Approximated size of the intervals used by the trapezoidal rule.
  real :: Int
  !! Numerical approximation to the integral

  integer :: i, N
  real :: h, x_l, x_m, x_r

  ! imposing that h must divide (b-a) in an even number
  ! of intervals
  N = ceiling((b-a)/h_in)
  if(modulo(N,2)==1) N = N+1
  h = (b-a)/N

  Int = 0.
  do i=1,N,2
    x_l = (i-1)*h
    x_m = i*h
    x_r = (i+1)*h
    Int = Int + (f(x_l)+4*f(x_m)+f(x_r))/3
  end do
  Int = Int*h
end function


function quad(f,a,b,h_in,method) result(Int)
  !! Approximates the integral:
  !! $$ \int_{a}^{b}f\left(x\right)\,\mathrm{d}x$$
  !! using some integration method on a linearly spaced
  !! set of points.
  interface
    function f(x) result(y)
      !! Function to be integrated
      real, intent(in) :: x
      !! independent variable
      real :: y
      !! dependent variable
    end function
  end interface
  real, intent(in) :: a
  !! Lower limit of integration
  real, intent(in) :: b
  !! Upper limit of integration
  real, intent(in) :: h_in
  !! Approximated size of the intervals used by the trapezoidal rule.
  character(*) :: method
  !! Method of integration to be used, can be either "Trapezoidal" or "Simpson"
  real :: Int
  !! Numerical approximation to the integral
  select case (method)
  case ("Trapezoidal")
    Int = quad_trapz(f,a,b,h_in)
  case ("Simpson")
    Int = quad_simpson(f,a,b,h_in)
  case default
    print*, 'Integration method "'//method//'"" not recognised,'
    print*, 'please choose between "Trapezoidal" and "Simpson"'
  end select
end function
end module
