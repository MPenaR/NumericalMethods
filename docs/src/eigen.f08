module eigenvectors
  !! Module for computing eigenvectors and their associated eigenvalues
    use linear_solvers, only: factor_LU, solve_LU
    implicit none

    contains
    subroutine eigen_max(A, v, lambda, maxIter, err_v, v_0)
      !! Given the matrix **A**, computes the eigenvector **v** associated to
      !! the eivenvalue of maximum modulus **lambda**  using the power method.
        real, intent(in) :: A(:,:)
      !! Symmetric matrix
        real, intent(out) :: v(size(A,1))
      !! Eigenvector
        real, intent(out) :: lambda
      !! Eigenvalue
        real, intent(in) :: err_v
      !! Precision for the stop criterion
        integer, intent(in) :: maxIter
      !! Maximum number of iterations
        real, intent(in) :: v_0(size(A,1))
      !! Initial vector for the iteration

        integer :: i
        real :: u(size(A,1))

        u = v_0
        u = u/norm2(u)

        do i = 1, maxIter
            v = matmul(A,u)
            lambda = dot_product(u,v)/dot_product(u,u)
            v = v/norm2(v)
            if ( dot_product(u,v)>0)then
              if (norm2(u-v)<err_v) exit
            elseif( dot_product(u,v)<0) then
              if (norm2(u+v)<err_v) exit
            end if
            u = v
        end do
        if( i>maxIter ) print*, 'the maximum number of iteration was reached &
                                & without obtaining convergence'
    end subroutine



    subroutine eigen_inv(A, v, lambda, p, maxIter, err_v, v_0)
      !! Given the matrix **A**, computes the eigenvector **v** associated to the eivenvalue
      !! **lambda** closer to the value **p** using the inverse power method.
        real, intent(in) :: A(:,:)
      !! Symmetric matrix
        real, intent(out) :: v(size(A,1))
      !! Eigenvector
        real, intent(out) :: lambda
      !! Eigenvalue
        real, intent(in) :: err_v
      !! Precision for the stop criterion
        integer, intent(in) :: maxIter
      !! Maximum number of iterations
        real, intent(in) :: v_0(size(A,1))
      !! Initial vector for the iteration
        real, intent(in) :: p
      !! value close to the eigenvalue wanted

        integer :: i
        real :: u(size(A,1)),  D(size(A,1),size(A,1))
        real :: Lo(size(A,1),size(A,1)), Up(size(A,1),size(A,1))

        u = v_0
        u = u/norm2(u)

        D = 0
        do i = 1, size(A,1)
          D(i,i) =  p
        end do


        call factor_LU(A-D,Lo,Up)

        do i = 1, maxIter
            v = solve_LU(Lo,Up,u)
            lambda = dot_product(u,v)
            v = v/norm2(v)
            lambda = 1./lambda + p
            if(dot_product(u,v)>0)then
                    if(norm2(v-u)<err_v) exit
            elseif( dot_product(u,v)<0) then
                    if (norm2(v+u)<err_v) exit
            end if
            u = v
        end do
        if( i>maxIter ) print*, 'the maximum number of iteration was reached &
                                & without obtaining convergence'
    end subroutine
end module
