package com.salon.service;
import com.salon.entity.Expense;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository repo;
    public Page<Expense> findAll(int page, int size) { return repo.findAll(PageRequest.of(page,size,Sort.by("expenseDate").descending())); }
    public Expense findById(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Expense not found")); }
    public Expense save(Expense e) { return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}
