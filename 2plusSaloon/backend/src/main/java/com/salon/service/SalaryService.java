package com.salon.service;
import com.salon.entity.*;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
@Service @RequiredArgsConstructor
public class SalaryService {
    private final SalaryRepository repo;
    private final EmployeeRepository empRepo;
    public Page<Salary> findAll(int page, int size) { return repo.findAll(PageRequest.of(page,size,Sort.by("salaryMonth").descending())); }
    public Salary findById(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Salary record not found")); }
    public Salary save(Salary s) {
        s.setFinalSalary(s.getBasicSalary().add(s.getIncentive()==null?BigDecimal.ZERO:s.getIncentive())
            .add(s.getCommission()==null?BigDecimal.ZERO:s.getCommission())
            .subtract(s.getDeduction()==null?BigDecimal.ZERO:s.getDeduction()));
        return repo.save(s);
    }
}
