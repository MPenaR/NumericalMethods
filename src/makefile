FC=gfortran -c -fbounds-check -pedantic
FL=gfortran -fbounds-check -pedantic

test_utilities: test_utilities.f90 utilities.o
	$(FL) $^ -o $@
utilities.o: utilities.f90
	$(FC) $<


test_linear_solvers: test_linear_solvers.f90 linear_solvers.o
	$(FL)  $^ -o $@
linear_solvers.o: linear_solvers.f90
	$(FC) $<

test_eigen: test_eigen.f90 eigen.o linear_solvers.o
	$(FL) $^ -o $@
eigen.o: eigen.f90 linear_solvers.o
	$(FC) $<

test_integrals: test_integrals.f90 integrals.o
	$(FL) $^ -o $@
integrals.o: integrals.f90
	$(FC) $<

test_non_linear_solvers: test_non_linear_solvers.f90 non_linear_solvers.o linear_solvers.o
	$(FL)  $^ -o $@
non_linear_solvers.o: non_linear_solvers.f90 linear_solvers.o
	$(FC) $<

all: test_non_linear_solvers test_integrals test_eigen test_linear_solvers test_utilities

.PHONY:clean
clean:
	rm -f *.o *.mod test_linear_solvers test_norms test_eigen test_derivatives test_integrals test_non_linear_solvers test_ode test_utilities
