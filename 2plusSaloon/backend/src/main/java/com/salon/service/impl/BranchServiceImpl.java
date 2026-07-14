package com.salon.service.impl;
import com.salon.dto.request.BranchRequest;
import com.salon.dto.response.BranchResponse;
import com.salon.entity.Branch;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional
public class BranchServiceImpl {
    private final BranchRepository repo;

    public BranchResponse create(BranchRequest req) {
        Branch b = Branch.builder().branchCode(req.getBranchCode()).branchName(req.getBranchName())
            .address(req.getAddress()).city(req.getCity()).state(req.getState())
            .country(req.getCountry()).email(req.getEmail()).phone(req.getPhone())
            .gstNumber(req.getGstNumber()).build();
        return toResponse(repo.save(b));
    }

    public BranchResponse update(Long id, BranchRequest req) {
        Branch b = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        b.setBranchName(req.getBranchName()); b.setAddress(req.getAddress());
        b.setCity(req.getCity()); b.setState(req.getState()); b.setPhone(req.getPhone());
        b.setEmail(req.getEmail()); b.setGstNumber(req.getGstNumber());
        return toResponse(repo.save(b));
    }

    public void delete(Long id) {
        Branch b = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        b.setStatus(false); repo.save(b);
    }

//    public Page<BranchResponse> list(int page, int size, String search) {
//        Pageable p = PageRequest.of(page, size, Sort.by("branchName"));
//        Page<Branch> result = (search != null && !search.isEmpty()) ? repo.search(search, p) : repo.findAllByStatusTrue(p);
//        return result.map(this::toResponse);
//    }

    public BranchResponse findById(Long id) {
        return toResponse(repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found")));
    }

    public List<BranchResponse> findAll() {
        return repo.findAll().stream().filter(Branch::getStatus).map(this::toResponse).collect(Collectors.toList());
    }

    private BranchResponse toResponse(Branch b) {
        return BranchResponse.builder().id(b.getId()).branchCode(b.getBranchCode())
            .branchName(b.getBranchName()).address(b.getAddress()).city(b.getCity())
            .state(b.getState()).country(b.getCountry()).email(b.getEmail())
            .phone(b.getPhone()).gstNumber(b.getGstNumber()).status(b.getStatus()).build();
    }
}
