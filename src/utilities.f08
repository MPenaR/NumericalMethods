module utilities
      !! module with utilities like printing a matrix, or some constants

      implicit none


      real :: pi = acos(-1.)
      !! mathematical constant pi
      real :: e = exp(1.)
      !! mathematical constante e

contains

      subroutine print_matrix(A)
      !! Prints a real matrix in a tabular form
      !! (can be improved)
          real, intent(in) :: A(:,:)
          !! matriz to be displayed
          integer :: M, N, i

          M = size(A,1)
          N = size(A,2)

          do i = 1, M
            print '(*(1x,G0,:,","))', A(i,:)
          end do
      end subroutine


      subroutine to_csv(D,filename)
        !! saves two-dimensional array **D** to csv
        !! file **filename**
          real, intent(in) :: D(:,:)
          !! array to be saved
          character(len=*), intent(in) :: filename
          !! path to the csv file

          integer :: i, N, u

          open(file=filename,newunit=u,status='new', action='write')
          N = size(D,1)
          do i = 1, N
            write(u,'(*(G0,:,",",1x))') D(i,:)
          end do
          close(u)
       end subroutine

      subroutine read_2_columns_csv(filename,D)
        !! Reads a two-column csv from file **filename**
        !! and stores it in **D**
        character(len=*), intent(in) :: filename
        !! path to the file
        real, intent(inout), allocatable :: D(:,:)
        !! array containing the two columns read

        integer :: i, N, u, IO_status

        open(file=filename,newunit=u, status='old')
        N = 0
        do
          read(u,*,IOstat=IO_status)
          if ( is_iostat_end(IO_status) ) exit
          N = N+1
        end do
        allocate(D(N,2))
        rewind(u)
        do i = 1, N
          read(u,*) D(i,1), D(i,2)
        end do
        close(u)
     end subroutine
end module
