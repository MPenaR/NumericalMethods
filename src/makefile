FC=gfortran -c -fbounds-check -pedantic
FL=gfortran -fbounds-check -pedantic


#Para compilar todos make all

#all: test_linear_solvers test_norms test_eigen test_derivatives test_integrals test_non_linear_solvers test_ode


test_linear_solvers: test_linear_solvers.f08 linear_solvers.o
	$(FL)  $^ -o $@
linear_solvers.o: linear_solvers.f08
	$(FC) $<

test_eigen: test_eigen.f08 eigen.o linear_solvers.o
	$(FL) $^ -o $@
eigen.o: eigen.f08 linear_solvers.o
	$(FC) $<

#test_derivatives: test_derivatives.f08 derivatives.o
#	$(FL) $^ -o $@
#
#derivatives.o: derivatives.f08
#	$(FC) $<

test_integrals: test_integrals.f08 integrals.o
	$(FL) $^ -o $@

integrals.o: integrals.f08
	$(FC) $<
#
#test_non_linear_solvers: test_non_linear_solvers.f08 non_linear_solvers.o linear_solvers.o norms.o
#	$(FL) $^ -o $@
#
#non_linear_solvers.o: non_linear_solvers.f08 norms.o linear_solvers.o
#	$(FC) $<
#
#test_ode: test_ode.f08 ode.o non_linear_solvers.o norms.o linear_solvers.o
#	$(FL) $^ -o $@
#
#ode.o: ode.f08 non_linear_solvers.o
#	$(FC) $<
#
#
.PHONY:clean
clean:
	rm -f *.o *.mod test_linear_solvers test_norms test_eigen test_derivatives test_integrals test_non_linear_solvers test_ode
