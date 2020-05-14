program test_ode
  !! program to test the ode module.
  !! The [Lorenz chaotic system](https://en.wikipedia.org/wiki/Lorenz_system) is solved:
  !! \[
  !! \frac{dx}{dt}=\\
  !! \frac{dx}{dt}=\\
  !! \frac{dx}{dt}=
  !! \]

  use ode

  implicit none

  integer, parameter :: N = 1000;
  real :: Tf, dT
  real :: t(0:N), y(0:N,3)
  integer :: i, u

  Tf = 10
  dT = Tf/N

  do i =0, N
    t(i) = i*dT
  end do

  y = forward_euler(lorenz, t, [ 1.,1.,1.])

  open(file='datos.dat',newunit=u)
  do i = 0, N
    write(u,*) t(i), y(i,1), y(i,2), y(i,3)
  end do
  close(u)


contains

  function lorenz(y,t) result(dy)
  !! function for defining the [Lorenz system](https://en.wikipedia.org/wiki/Lorenz_system)
    real, intent(in) :: y(:)
    real, intent(in) :: t
    real :: dy(size(y))
    real, parameter :: a = 10.
    real, parameter :: b = 28.
    real, parameter :: c = 8./3.
    dy(1) = a*(y(2)-y(1))
    dy(2) = y(1)*(b-y(3)) - y(2)
    dy(3) =y(1)*y(2) - c*y(3)
  end function
end program
