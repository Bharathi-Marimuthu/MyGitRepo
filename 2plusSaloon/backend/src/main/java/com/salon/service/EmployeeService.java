package com.salon.service;
import com.salon.entity.Employee;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository repo;
    public Page<Employee> findAll(int page, int size) { return repo.findAll(PageRequest.of(page,size,Sort.by("createdAt").descending())); }
    public Employee findById(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found")); }
    public Employee save(Employee e) { if(e.getEmployeeCode()==null) e.setEmployeeCode("EMP"+String.format("%04d",repo.count()+1)); return repo.save(e); }
    public Employee update(Long id, Employee e) { Employee x=findById(id); x.setFullName(e.getFullName()); x.setMobile(e.getMobile()); x.setDesignation(e.getDesignation()); return repo.save(x); }
    public void delete(Long id) { repo.deleteById(id); }
}
