package com.salon.service;
import com.salon.entity.Product;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;
@Service @RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repo;
    public Page<Product> findAll(int page, int size) { return repo.findAll(PageRequest.of(page,size)); }
    public Product findById(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found")); }
    public Product save(Product p) { if(p.getProductCode()==null) p.setProductCode("PR"+String.format("%04d",repo.count()+1)); return repo.save(p); }
    public Product update(Long id, Product p) { Product e=findById(id); e.setProductName(p.getProductName()); e.setSellingPrice(p.getSellingPrice()); e.setQuantity(p.getQuantity()); return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Product> getLowStock() { return repo.findAll().stream().filter(p -> p.getQuantity() <= p.getReorderLevel()).collect(java.util.stream.Collectors.toList()); }
}
