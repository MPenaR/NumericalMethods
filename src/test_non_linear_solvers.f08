program test_non_linear_solvers
  !! program to test the non_linear_solvers module

  use non_linear_solvers

  implicit none

  print*, Bisection(f,0.,1.234,0.001)


contains

  function f(x) result(y)
    real, intent(in) :: x
    real :: y

    y = exp(x) - exp(1.)
  end function

end program
