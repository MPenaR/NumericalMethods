program test_eigenvectors
  !! Program to show the usage of the the *eigenvectors* module.
        use eigenvectors
        implicit none
        integer, parameter :: N = 3
        integer :: i
        real :: A(N,N), v(N), lambda1, lambda2, lambda3
        character(:), allocatable :: fmt

        fmt = '(F7.2)'

        A(1,:) = [ 1., 0., 0. ]
        A(2,:) = [ 0., -0.5, 0. ]
        A(3,:) = [ 0., 0., -4.]

        call eigen_max(A, v, lambda1, maxIter= 1000, err_v=1.E-6, v_0=[1.,1.,1.])
        print*, "biggest eigenvalue: "
        write(*,fmt=fmt) lambda1
        print*, "associated eigenvector: "
        do i = 1,N
          write(*,fmt=fmt) v(i)
        end do


        call eigen_inv(A, v, lambda1, maxIter= 1000, p=0., err_v=1.E-6, v_0=[1.,1.,1.])
        print*, "smallest eigenvalue: "
        write(*,fmt=fmt) lambda1
        print*, "associated eigenvector: "
        do i = 1,N
          write(*,fmt=fmt) v(i)
        end do

end program
