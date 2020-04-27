program test_non_linear_solvers
  !! program to test the non_linear_solvers module

  use non_linear_solvers

  implicit none

  print*, Bisection(f,0.,1.234,0.001)
  print*, Newton(f,df,0.,0.001,0.001,1000)
  print*, Secant(f,[0.,0.1],0.001,0.001,1000)


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

end program
