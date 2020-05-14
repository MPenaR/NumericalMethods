program test_ode
  !! Program to test the ode module.
  !! The [Lorenz chaotic system](https://en.wikipedia.org/wiki/Lorenz_system) is solved:
  !! \[
  !! \frac{dx}{dt}= a\left(y-x\right)\\
  !! \frac{dy}{dt}= x\left(b-z\right) - y \\
  !! \frac{dz}{dt}= xy - cz
  !! \]
  !! The system is integrated for \(t\in[0,10]\) with \(a=\), \(b=\) and \(c=\).
  !! For initial conditions \(\left(x(0),y(0),z(0)\right) = \left(1,1,1\right)\), the solution is:
  !! ![Image of the trayectory](../../lorenz.png)
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
  !! function for defining derivative in the [Lorenz system](https://en.wikipedia.org/wiki/Lorenz_system)
  !! written as:
  !! \[
  !! \frac{d\mathbf{y}}{dt}=\mathbf{F}\left(\mathbf{y},t\right)
  !! \]
  !! where:
  !! \[
  !! f_1 = a \left( y_2 - y_1 \right) \\
  !! f_2 = y_1 \left( b - y_3 \right) - y_2 \\
  !! f_3 = y_1 y_2 - cy_3
  !! \]
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
