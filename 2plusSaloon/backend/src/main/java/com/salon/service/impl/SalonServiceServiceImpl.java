package com.salon.service.impl;
import com.salon.dto.request.SalonServiceRequest;
import com.salon.dto.response.ServiceResponse;
import com.salon.entity.SalonService;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor @Transactional
public class SalonServiceServiceImpl {
    private final SalonServiceRepository repo;
    public ServiceResponse create(SalonServiceRequest req) {
        String code = "SV" + String.format("%04d", repo.count() + 1);
        SalonService s = SalonService.builder().serviceCode(code).serviceName(req.getServiceName())
            .category(req.getCategory()).durationMins(req.getDurationMins())
            .price(req.getPrice()).gstPercentage(req.getGstPercentage()).build();
        return toResponse(repo.save(s));
    }
    public ServiceResponse update(Long id, SalonServiceRequest req) {
        SalonService s = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        s.setServiceName(req.getServiceName()); s.setCategory(req.getCategory());
        s.setDurationMins(req.getDurationMins()); s.setPrice(req.getPrice());
        return toResponse(repo.save(s));
    }
    public Page<ServiceResponse> list(int page, int size) {
        return repo.findByStatusTrue(PageRequest.of(page, size, Sort.by("serviceName"))).map(this::toResponse);
    }
    public List<ServiceResponse> listAll() {
        return repo.findAll().stream().filter(SalonService::isStatus).map(this::toResponse).collect(Collectors.toList());
    }
    private ServiceResponse toResponse(SalonService s) {
        return ServiceResponse.builder().id(s.getId()).serviceCode(s.getServiceCode())
            .serviceName(s.getServiceName()).category(s.getCategory())
            .durationMins(s.getDurationMins()).price(s.getPrice())
            .gstPercentage(s.getGstPercentage()).status(s.isStatus()).build();
    }
}
