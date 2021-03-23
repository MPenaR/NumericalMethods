program test_utilities
      use utilities
      implicit none
      integer, parameter :: M = 3, N = 4
      real :: A(M,N)

      call random_number(A)
      A = A - 0.5
      print*, "A ="
      call print_matrix(A)
end program
