module linear_solvers
  !! Module for computing solutions to linear systems of the form:
  !! $$\mathbf{A}\mathbf{x}=\mathbf{b}$$
  implicit none

  contains

  function solve_U(U,b) result(x)
    !! Computes the solution of an upper triangular system:
    !! $$ \mathbf{U}\mathbf{x} = \mathbf{b}$$
      real, intent(in) :: U(:,:)
    !! Upper triangular matrix
      real, intent(in) :: b(:)
    !! Right hand side vector
      real :: x(size(U,2))
    !! Solution vector **x**

    integer :: i, N

    N = size(U,2)

    x(N) = b(N)/U(N,N)

    do i=N-1,1,-1
      x(i) = ( b(i) - dot_product(U(i,i+1:N),x(i+1:N)))/U(i,i)
    end do

  end function


  function solve_L(L,b) result(x)
  !! Computes the solution of a lower triangular system:
  !! $$ \mathbf{L}\mathbf{x} = \mathbf{b}$$
    real, intent(in) :: L(:,:)
  !! Lower triangular matrix
    real, intent(in) ::  b(:)
  !! Right hand side vector
    real :: x(size(L,2))
  !! Solution vector **x**

    integer :: i, N

    N = size(L,2)

    x(1) = b(1)/L(1,1)

    do i=2,N
      x(i) = ( b(i) - dot_product(L(i,1:i-1),x(1:i-1)))/L(i,i)
    end do

  end function







  function gauss_solve(A,b) result(x)
    !! Computes the solution of the system:
    !!  $$\mathbf{A}\mathbf{x}=\mathbf{b}$$
    !! where **A** is a non-singular matrix.
      real, intent(in) :: A(:,:)
    !! Non-singular matrix
      real, intent(in) :: b(:)
    !! Right hand side vector
      real :: x(size(A,2))
    !! Solution vector **x**

    real :: M(size(A,1),size(A,2)+1)
    integer :: N

    N = size(A,2)
    M(:,1:N) = A
    M(:,N+1) = b

    call make_U(M)

    x = solve_U(M(:,1:N),M(:,N+1))
  end function



    subroutine factor_LU(A,L,U)
      !! Computes de LU factorization of a non-singular matrix **A**
      !! $$\mathbf{A}=\mathbf{L}\mathbf{U}$$
        real, intent(in) :: A(:,:)
      !! Non-singular matrix
        real, intent(out) :: L(size(A,1),size(A,2))
      !! Lower triangular matrix
        real, intent(out) :: U(size(A,1),size(A,2))
      !! Upper triangular matrix

      integer :: N, i, j, k

      N = size(A,2)

      L = 0
      U = 0

      do k = 1, N

        do j = k, N
          U(k,j) = A(k,j) - dot_product(L(k,1:k-1),U(1:k-1,j))
        end do

        L(k,k) = 1
        do i = k+1, N
          L(i,k) = ( A(i,k) - dot_product(L(i,1:k-1),U(1:k-1,k))) / U(k,k)
        end do

      end do

    end subroutine

    function solve_LU(L,U,b) result(x)
      !! Computes the solution to the system:
      !! $$\mathbf{L}\mathbf{U}\mathbf{x}=\mathbf{b}$$
      !! where **L** and **U** are the matrices obtained from
      !! a LU factorization.
        real, intent(in) :: L(:,:)
      !! Lower triangular matrix
      real, intent(in) :: U(:,:)
      !! Upper triangular matrix
        real, intent(in) :: b(:)
      !! Right hand side vector
        real :: x(size(b))
      !! Solution vector **x**

      x = solve_U(U,solve_L(L,b))

    end function

    function solve(A,b) result(x)
      !! Computes the solution to the system:
      !! $$\mathbf{A}\mathbf{x}=\mathbf{b}$$
      !! using LU factorization.
        real, intent(in) :: A(:,:)
      !! Non-singular matrix
        real, intent(in) :: b(:)
      !! Right hand side vector
        real :: x(size(b))
      !! Solution vector **x**

      real :: L(size(A,1),size(A,2)), U(size(A,1), size(A,2)), Ap(size(A,1),size(A,2))

      call factor_LU(A,L,U)

      x = solve_LU(L,U,b)

    end function


    function Jacobi(A,b,x_0, maxIter, err_x) result(x)
      !! Computes the solution to the system
      !! $$\mathbf{A}\mathbf{x}=\mathbf{b}$$
      !! using the Jacobi iterative method.
        real, intent(in) :: A(:,:)
      !! Non-singular matrix
        real, intent(in) :: b(:)
      !! Right hand side vector
        real, intent(in) :: x_0(:)
      !! Initial approximation for the iteration
        integer, intent(in) :: maxIter
      !! Maximum number of iterations
        real, intent(in) :: err_x
      !! Precision for the stop criterion
        real :: x(size(A,2))
      !! Solution vector **x**

      integer :: i, N
      real :: x_old(size(A,2)), L(size(A,1),size(A,2)),U(size(A,1),size(A,2)), D_inv(size(A,2))

      N = size(A,2)

      L = 0
      U = 0
      do i = 1, N
        L(i,1:i-1)=A(i,1:i-1)
        D_inv(i) = 1./A(i,i)
        U(i,i+1:N) = A(i,i+1:N)
      end do


      x_old = x_0
      do i = 1, maxIter
        x = -D_inv*MATMUL(L+U,x_old)+D_inv*b
        if ( norm2(x-x_old)/norm2(x) < err_x ) exit
        x_old = x
      end do
      if( i>maxIter ) print*, 'the maximum number of iteration was reached &
                              & without obtaining convergence'
    end function

    function GaussSeidel(A,b,x_0, maxIter, err_x) result(x)
      !! Computes the solution to the system
      !! $$\mathbf{A}\mathbf{x}=\mathbf{b}$$
      !! using the Gauss-Seidel iterative method.
        real, intent(in) :: A(:,:)
      !! Non-singular matrix
        real, intent(in) :: b(:)
      !! Right hand side vector
        real, intent(in) :: x_0(:)
      !! Initial approximation for the iteration
        integer, intent(in) :: maxIter
      !! Maximum number of iterations
        real, intent(in) :: err_x
      !! Precision for the stop criterion
        real :: x(size(A,2))
      !! Solution vector **x**

      integer :: i, N
      real :: x_old(size(A,2)), LD(size(A,1),size(A,2)), U(size(A,1),size(A,2))

      N = size(A,2)

      LD = 0
      U = 0
      do i = 1, N
        LD(i,  1:i) = A(i,  1:i)
        U (i,i+1:N) = A(i,i+1:N)
      end do


      x_old = x_0
      do i = 1, maxIter
        x = solve_L(LD,-MATMUL(U,x_old)+b)
        if ( norm2(x-x_old)/norm2(x) < err_x ) exit
        x_old = x
      end do
      if( i>maxIter ) print*, 'the maximum number of iteration was reached &
                              & without obtaining convergence'
    end function




end module
