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

        function forward_euler(f,t,U0) result(U)
          !! function for integrating vector first order ODEs of the form:
          !! \[
          !! \frac{d\mathbf{U}}{dt}=\mathbf{F}\left(\mathbf{U},t\right)
          !! \]
          !! using the forward (explicit) euler method.
          interface
            function f(U,t) result(dU)
            !! function \(\mathbf{F}\) of the system
              real, intent(in) :: U(:)
            !! value of the unknown function \(\mathbf{U}(t)\)
              real, intent(in) :: t
            !! independent variable \(t\)
              real :: dU(size(U))
            !! derivative of \(\mathbf{y}\)
            end function
          end interface
          real, intent(in) :: t(0:)
          !! array of times \( t_0,t_1,\dots,t_N \)where the numerical solution
          !! will be evaluated.
          real, intent(in) :: U0(:)
          !! initial conditions \(\mathbf{U}(t_0)\)
          real :: U(0:ubound(t,1),size(U0))
          !! solution array \(U_j(t_i)\) such that the
          !! the row \(i\) and column \(j\) stands for the
          !! \(j\)th component of the vector solution \(\mathbf{U}\) at time \(t_i\).
          integer :: N, i
          N = ubound(t,1)
          U(0,:) = U0
          do i=1,N
            U(i,:) = U(i-1,:) + (t(i)-t(i-1))*F(U(i-1,:),t(i-1))
          end do
        end function

end module
