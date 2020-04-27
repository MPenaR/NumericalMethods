FC=gfortran -c -fbounds-check -pedantic
FL=gfortran -fbounds-check -pedantic

test_utilities: test_utilities.f08 utilities.o
	$(FL) $^ -o $@
utilities.o: utilities.f08
	$(FC) $<


test_linear_solvers: test_linear_solvers.f08 linear_solvers.o
	$(FL)  $^ -o $@
linear_solvers.o: linear_solvers.f08
	$(FC) $<

test_eigen: test_eigen.f08 eigen.o linear_solvers.o
	$(FL) $^ -o $@
eigen.o: eigen.f08 linear_solvers.o
	$(FC) $<

test_integrals: test_integrals.f08 integrals.o
	$(FL) $^ -o $@
integrals.o: integrals.f08
	$(FC) $<

test_non_linear_solvers: test_non_linear_solvers.f08 non_linear_solvers.o
	$(FL)  $^ -o $@
non_linear_solvers.o: non_linear_solvers.f08
	$(FC) $<


.PHONY:clean
clean:
	rm -f *.o *.mod test_linear_solvers test_norms test_eigen test_derivatives test_integrals test_non_linear_solvers test_ode
