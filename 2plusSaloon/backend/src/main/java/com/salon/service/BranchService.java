package com.salon.service;
import com.salon.entity.Branch;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class BranchService {
    private final BranchRepository repo;
    public Page<Branch> findAll(int page, int size) { return repo.findAll(PageRequest.of(page,size)); }
    public Branch findById(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found")); }
    public Branch save(Branch b) { if(b.getBranchCode()==null) b.setBranchCode("BR"+String.format("%03d",repo.count()+1)); return repo.save(b); }
    public Branch update(Long id, Branch b) { Branch e=findById(id); e.setBranchName(b.getBranchName()); e.setAddress(b.getAddress()); e.setCity(b.getCity()); e.setPhone(b.getPhone()); return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}
