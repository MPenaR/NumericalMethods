module non_linear_solvers
  !! Module for solving non-linear equations of the form:
  !! $$ \mathbf{f}\left(\mathbf{x}\right)=\mathbf{0} $$
  !! There are specific functions for the scalar case.

  implicit none

contains

  function Bisection(f,a,b,err_x) result(x)
    !! Solves the scalar non-linear equation:
    !! $$ f(x)=0 $$
    !! using the bisection method on the interval [a,b]
    interface
      function f(x) result(y)
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
         return
       else if(f(x)*f(x_l)>0) then
         x_l = x
       else
         x_r = x
       end if
     end do
   end function
 end module
