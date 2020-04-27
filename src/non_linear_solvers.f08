module non_linear_solvers
  !! Module for solving non-linear equations of the form:
  !! $$ \mathbf{f}\left(\mathbf{x}\right)=\mathbf{0} $$
  !! There are specific functions for the scalar case.

  use linear_solvers, only: solve

  implicit none

contains

  function Bisection(f,a,b,err_x) result(x)
    !! Solves the scalar non-linear equation:
    !! $$ f(x)=0 $$
    !! using the bisection method on the interval [a,b]
    interface
      function f(x) result(y)
        !! function defining the non-linear equation
        real, intent(in) :: x
        !! independent variable
        real :: y
        !! dependent variable
      end function
    end interface
    real, intent(in) :: a
    !! left boundary of the interval
    real, intent(in) :: b
    !! right boundary of the interval
    real, intent(in) :: err_x
    !! admisible error in the solution, that is:
    !! $$ x_\mathrm{true} = x \pm \frac{\eps_{x}}{2} $$
    real :: x
    !! numerical aproximation to the solution

    integer :: N, i
    real :: x_l, x_r

    if(f(a)*f(b)>=0) error stop "f(a) and f(b) must have different signs"

     if (a>b) then
       error stop "a cannot be greater than b"
     else if(a==b) then
       x=a
       return
     else
       N = ceiling(log((b-a)/err_x)/log(2.))
     end if
     x_l = a
     x_r = b
     do i = 1, N
       x = (x_l+x_r)/2
       if ( f(x)==0)then
         exit
       else if(f(x)*f(x_l)>0) then
         x_l = x
       else
         x_r = x
       end if
     end do
   end function

   function Newton(f, df, x0, err_x, err_f, max_iter) result(x)
     !! Solves the scalar non-linear equation:
     !! $$ f(x) = 0 $$
     !! using Newton's method.
     interface
       function f(x) result(y)
         !! function defining the non-linear equation
         real, intent(in) :: x
         !! independent variable
         real :: y
         !! dependent variable
       end function
       function df(x) result(y)
         !! derivative of function \(f\)
         real, intent(in) :: x
         !! independent variable
         real :: y
         !! dependent variable
       end function
     end interface
     real, intent(in) :: x0
     !! initial aproximation to the solution
     real, intent(in) :: err_x
     !! admisible error in the solution
     real, intent(in) :: err_f
     !! admisible error in the equation
     integer, intent(in) :: max_iter
     !! maximum number of iterations
     real :: x
     !! numerical aproximation to the solution

     integer :: i
     real :: x_old

     x_old = x0
     do i = 1, max_iter
       x  = x_old - f(x_old)/df(x_old)
       if ( ( abs(f(x))<err_f ) .or. ( abs(x-x_old) < err_x) ) exit
       x_old = x
     end do
     if(i>max_iter) print*, "maximum number of iterations reached without convergence"
  end function

  function Secant(f, x0, err_x, err_f, max_iter) result(x)
    !! Solves the scalar non-linear equation:
    !! $$ f(x) = 0 $$
    !! using the secant method.
    interface
      function f(x) result(y)
        !! function defining the non-linear equation
        real, intent(in) :: x
        !! independent variable
        real :: y
        !! dependent variable
      end function
    end interface
    real, intent(in) :: x0(2)
    !! array containing the first and second aproximations to the solution
    real, intent(in) :: err_x
    !! admisible error in the solution
    real, intent(in) :: err_f
    !! admisible error in the equation
    integer, intent(in) :: max_iter
    !! maximum number of iterations
    real :: x
    !! numerical aproximation to the solution

    integer :: i
    real :: x_old(2)

    x_old = x0
    do i = 1, max_iter
      x  = x_old(2) - f(x_old(2))* (x_old(2) - x_old(1)) / ( f(x_old(2))-f(x_old(1)))
      if ( ( abs(f(x))<err_f ) .or. ( abs(x-x_old(2)) < err_x) ) exit
      x_old = [ x_old(2), x ]
    end do
    if(i>max_iter) print*, "maximum number of iterations reached without convergence"
 end function

 function VectorNewton(f, J, x0, err_x, err_f, max_iter) result(x)
   !! Solves the vector non-linear equation:
   !! $$ f(x) = 0 $$
   !! using Newton's method.
   interface
     function f(x) result(y)
       !! function defining the non-linear equation
       real, intent(in) :: x(:)
       !! independent variable
       real :: y(size(x))
       !! dependent variable
     end function
     function J(x) result(y)
       !! jacobian of function \(f\)
       real, intent(in) :: x(:)
       !! independent variable
       real :: y(size(x), size(x))
       !! dependent variable
     end function
   end interface
   real, intent(in) :: x0(:)
   !! initial aproximation to the solution: (x0,y0)
   real, intent(in) :: err_x
   !! admisible error in the solution
   real, intent(in) :: err_f
   !! admisible error in the equation
   integer, intent(in) :: max_iter
   !! maximum number of iterations
   real :: x(size(x0))
   !! numerical aproximation to the solution

   integer :: i
   real :: x_old(size(x0))

   x_old = x0
   print*, J(x_old)
   do i = 1, max_iter
     x  = x_old - solve(J(x_old),f(x_old))
     if ( ( norm2(f(x))<err_f ) .or. ( norm2(x-x_old) < err_x) ) exit
     x_old = x
   end do
   if(i>max_iter) print*, "maximum number of iterations reached without convergence"
 end function

end module
