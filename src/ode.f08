module ode
  !! Module for solving first order explicit ordinary differential equations, expressed in the form:
  !! \[
  !! \frac{dy}{dt}=F\left(y,t\right)\\
  !! y(0) = y_0
  !! \]
  !! where, \(y(t)\) is the unknown function, \(t\) is the independent variable and
  !! \(y_0\) is the initial condition.
      implicit none
      contains

        function forward_euler(f,t,y0) result(y)
          !! function for integrating vector first order ODEs of the form:
          !! \[
          !! \frac{d\mathbf{y}}{dt}=\mathbf{F}\left(\mathbf{y},t\right)
          !! \]
          !! using the forward (explicit) euler method.
          interface
            function f(y,t) result(dy)
            !! function \(\mathbf{F}\) of the system
              real, intent(in) :: y(:)
            !! value of the unknown function \(\mathbf{y}(t)\)
              real, intent(in) :: t
            !! independent variable \(t\)
              real :: dy(size(y))
            !! derivative of \(\mathbf{y}\)
            end function
          end interface
          real, intent(in) :: t(0:)
          !! array of times \( t_0,t_1,\dots,t_N \)where the numerical solution
          !! will be evaluated.
          real, intent(in) :: y0(:)
          !! initial conditions \(\mathbf{y}(t_0)\)
          real :: y(0:ubound(t,1),size(y0))
          !! solution array \(\mathbf{y}_j(t_i)\) such that the
          !! the row \(i\) and column \(j\) stands for the
          !! \(j\)th component of the vector solution \(\mathbf{y}\) at time \(t_i\).
          integer :: N, i
          N = ubound(t,1)
          y(0,:) = y0
          do i=1,N
            y(i,:) = y(i-1,:) + (t(i)-t(i-1))*F(y(i-1,:),t(i-1))
          end do
        end function

end module
