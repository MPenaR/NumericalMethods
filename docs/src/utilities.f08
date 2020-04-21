module utilities
      !! module with utilities like printing a matrix, or some constants
      
      implicit none


      real :: pi = acos(-1.)
      !! mathematical constant pi
      real :: e = exp(1.)
      !! mathematical constante e

contains

      subroutine print_matrix(A)
      !! Prints a matrix in a tabular form        
              real, intent(in) :: A(:,:)
              integer :: M, N, i

              M = size(A,1)
              N = size(A,2)

              do i = 1, M
                print '(*(1x,F5.2,:,","))', A(i,:)
              end do
      end subroutine
end module




