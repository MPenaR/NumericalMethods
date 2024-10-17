program test_linear_solvers
  !! Program to show the usage of the *linear_solvers* module
  use linear_solvers
  implicit none

  integer, parameter :: N = 500
  real:: ti, tf

  real :: A(N,N), b(N), x_G(N), x_LU(N), x_J(N), x_GS(N), x_0(N)
  integer :: i, u, Nmax
  b = 0
  b(N) = -1.
  A = 0.
  do i = 1,N-1
    A(i,i+1) = 1.
    A(i,i) = -2.
    A(i+1,i) = 1.
  end do
  A(N,N) = -2

  call CPU_TIME(ti)
  x_G = gauss_solve(A,b)
  call CPU_TIME(tf)

  print*, 'Gauss'
  print'(3(A,1x,f9.6,A))',  'x =', x_G(1), NEW_LINE('a'), 'y =', x_G(2),NEW_LINE('a'), 'z =', x_G(3), NEW_LINE('a')
  print'(A,1x,I6,1x,A)', 'in', floor((tf -ti)*1E3), 'miliseconds'


  call CPU_TIME(ti)
  x_LU = solve(A,b)
  call CPU_TIME(tf)


  print*, 'LU'
  print'(3(A,1x,f9.6,A))',  'x =', x_LU(1), NEW_LINE('a'), 'y =', x_LU(2),NEW_LINE('a'), 'z =', x_LU(3), NEW_LINE('a')
  print'(A,1x,I6,1x,A)', 'in', floor((tf -ti)*1E3), 'miliseconds'


  Nmax = 100000

  ! x_0 = 0.5
  x_0(1:N/2) = 0.25
  x_0(N/2+1:N) = 0.75

  call CPU_TIME(ti)
  x_J = Jacobi(A,b, x_0, Nmax, 0.0001)
  call CPU_TIME(tf)

  print*, 'Jacobi'
  print'(3(A,1x,f9.6,A))',  'x =', x_J(1), NEW_LINE('a'), 'y =', x_J(2),NEW_LINE('a'), 'z =', x_J(3), NEW_LINE('a')
  print'(A,1x,I6,1x,A)', 'in', floor((tf -ti)*1E3), 'miliseconds'


  call CPU_TIME(ti)
  x_GS = GaussSeidel(A,b, x_0, Nmax, 0.0001)
  call CPU_TIME(tf)

  print*, 'Gauss-Seidel'
  print'(3(A,1x,f9.6,A))',  'x =', x_GS(1), NEW_LINE('a'), 'y =', x_GS(2),NEW_LINE('a'), 'z =', x_GS(3), NEW_LINE('a')
  print'(A,1x,I6,1x,A)', 'in', floor((tf -ti)*1E3), 'miliseconds'

  open(file='test.dat',newunit=u, action='write', status='unknown')
  do i = 1,N
    write(u,*) x_G(i), x_LU(i), x_J(i), x_GS(i)
  end do
  close(u)
end program
