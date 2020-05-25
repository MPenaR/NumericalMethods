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

  function lorenz(U,t) result(dU)
  !! function for defining derivative in the 
  !! [Lorenz system](https://en.wikipedia.org/wiki/Lorenz_system)
  !! written as:
  !! \[
  !! \frac{d\mathbf{U}}{dt}=\mathbf{F}\left(\mathbf{U},t\right)
  !! \]
  !! where:
  !! \[
  !! \mathbf{U}\left(t\right) = 
  !! \begin{pmatrix}
  !! x\left(t\right)\\
  !! y\left(t\right)\\
  !! z\left(t\right)
  !! \end{pmatrix}
  !! \]
  !! and
  !! \[
  !! \mathbf{F}\left(\mathbf{U},t\right)=
  !! \begin{pmatrix}
  !!  a \left( U_2 - U_1 \right) \\
  !!  U_1 \left( b - U_3 \right) - U_2 \\
  !!  U_1 U_2 - cU_3
  !! \end{pmatrix}
  !! \]
    real, intent(in) :: U(:)
    real, intent(in) :: t
    real :: dU(size(U))
    real, parameter :: a = 10.
    real, parameter :: b = 28.
    real, parameter :: c = 8./3.
    dU(1) = a*(U(2)-U(1))
    dU(2) = U(1)*(b-U(3)) - U(2)
    dU(3) =U(1)*U(2) - c*U(3)
  end function
end program
