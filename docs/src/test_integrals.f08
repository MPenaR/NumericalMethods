program test_integrals
  !! program to show the usage of the *integrals* module
  use integrals, only : trapz, quad
  implicit none


  real, parameter :: pi = acos(-1.)
  real :: a, b, h, Int
  integer :: i

  a = 0.
  b = 2*pi
  h = 0.001



  Int = quad( f, a, b, h, 'Trapezoidal' )
  print*, "Integral of sin(x) between 0 and 2pi using the trapezoidal rule:"
  print'(F6.3)', Int

  Int = quad( f, a, b, h, 'Simpson' )
  print*, "Integral of sin(x) between 0 and 2pi using Simpson's rule:"
  print'(F6.3)', Int

  a = 0.
  b = 1.
  h = 0.001

  Int = quad( g, a, b, h,'Trapezoidal' )
  print*, "Integral of x^4 between 0 and 1 using the trapezoidal rule:"
  print'(F6.3)', Int

  Int = quad( g, a, b, h, 'Simpson' )
  print*, "Integral of x^4 between 0 and 1 using Simpson's rule:"
  print'(F6.3)', Int

  Int = quad( g, 0., 1., h, 'Muller' )

contains
  function f(x) result(y)
    real, intent(in) :: x
    real :: y
    y = sin(x)
  end function

  function g(x) result(y)
    real, intent(in) :: x
    real :: y
    y = x**4
  end function

end program
