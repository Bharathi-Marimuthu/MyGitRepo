package com.salon.service;
import com.salon.entity.Service;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
@org.springframework.stereotype.Service @RequiredArgsConstructor
public class ServiceManagementService {
    private final ServiceRepository repo;
    public Page<Service> findAll(int page, int size) { return repo.findAll(PageRequest.of(page,size)); }
    public Service findById(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Service not found")); }
    public Service save(Service s) { if(s.getServiceCode()==null) s.setServiceCode("SV"+String.format("%04d",repo.count()+1)); return repo.save(s); }
    public Service update(Long id, Service s) { Service e=findById(id); e.setServiceName(s.getServiceName()); e.setPrice(s.getPrice()); e.setCategory(s.getCategory()); e.setDurationMins(s.getDurationMins()); return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}
