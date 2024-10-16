program test_non_linear_solvers
  !! program to test the non_linear_solvers module

  use non_linear_solvers

  implicit none

  print*, Bisection(f,0.,1.234,0.001)
  print*, Newton(f,df,0.,0.001,0.001,1000)
  print*, Secant(f,[0.,0.1],0.001,0.001,1000)
  print*, VectorNewton(f_vec,J,[0.5,0.5],0.001,0.001,1000)

contains

  function f(x) result(y)
    real, intent(in) :: x
    real :: y
    y = exp(x) - exp(1.)
  end function

  function df(x) result(y)
    real, intent(in) :: x
    real :: y
    y = exp(x)
  end function

  function f_vec(x) result(y)
    real, intent(in) :: x(:)
    real :: y(size(x))

    y(1) = exp(x(1)) - exp(1.)
    y(2) = x(1)*cos(x(2))
  end function
  function J(x) result(y)
    real, intent(in) :: x(:)
    real :: y(size(x),size(x))
    y(1,:) = [ exp(x(1)),              0. ]
    y(2,:) = [ cos(x(2)), -x(1)*sin(x(2)) ]
  end function
end program
