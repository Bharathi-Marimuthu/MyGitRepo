package com.salon.service;
import com.salon.entity.Customer;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;
@Service @RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository repo;
    public Page<Customer> findAll(int page, int size) { return repo.findAll(PageRequest.of(page,size,Sort.by("createdAt").descending())); }
    public Customer findById(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer #"+id+" not found")); }
    public Customer save(Customer c) { if(c.getCustomerCode()==null||c.getCustomerCode().isBlank()) c.setCustomerCode("CUS"+String.format("%04d",repo.count()+1)); return repo.save(c); }
    public Customer update(Long id, Customer c) { Customer existing = findById(id); existing.setFullName(c.getFullName()); existing.setMobile(c.getMobile()); existing.setEmail(c.getEmail()); existing.setGender(c.getGender()); existing.setAddress(c.getAddress()); return repo.save(existing); }
    public void delete(Long id) { repo.deleteById(id); }
}
