package com.salon.service.impl;
import com.salon.dto.request.CustomerRequest;
import com.salon.dto.response.CustomerResponse;
import com.salon.entity.Branch;
import com.salon.entity.Customer;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.BranchRepository;
import com.salon.repository.CustomerRepository;
import com.salon.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor @Transactional
public class CustomerServiceImpl {
    private final CustomerRepository repo;
    private final BranchRepository branchRepo;
    private final InvoiceRepository invoiceRepo;

    public CustomerResponse create(CustomerRequest req) {
        Branch branch = branchRepo.findById(req.getBranchId()).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        String code = "CUS" + String.format("%05d", repo.count() + 1);
        Customer c = Customer.builder().customerCode(code).fullName(req.getFullName())
            .mobile(req.getMobile()).email(req.getEmail()).gender(req.getGender())
            .dateOfBirth(req.getDateOfBirth()).anniversaryDate(req.getAnniversaryDate())
            .address(req.getAddress()).branch(branch).build();
        return toResponse(repo.save(c));
    }

    public CustomerResponse update(Long id, CustomerRequest req) {
        Customer c = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        c.setFullName(req.getFullName()); c.setEmail(req.getEmail());
        c.setGender(req.getGender()); c.setAddress(req.getAddress());
        c.setDateOfBirth(req.getDateOfBirth()); c.setAnniversaryDate(req.getAnniversaryDate());
        return toResponse(repo.save(c));
    }

//    public Page<CustomerResponse> list(int page, int size, String search) {
//        Pageable p = PageRequest.of(page, size, Sort.by("fullName"));
//        return (search != null && !search.isEmpty()) ? repo.search(search, p).map(this::toResponse)
//            : repo.findAll(p).map(this::toResponse);
//    }

    public CustomerResponse findById(Long id) {
        return toResponse(repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not found")));
    }

    private CustomerResponse toResponse(Customer c) {
        return CustomerResponse.builder().id(c.getId()).customerCode(c.getCustomerCode())
            .fullName(c.getFullName()).mobile(c.getMobile()).email(c.getEmail())
            .gender(c.getGender()).membershipType(c.getMembershipType())
            .loyaltyPoints(c.getLoyaltyPoints()).createdAt(c.getCreatedAt()).build();
    }
}
