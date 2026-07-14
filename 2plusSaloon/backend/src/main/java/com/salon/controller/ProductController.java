package com.salon.controller;
import com.salon.dto.response.ApiResponse;
import com.salon.entity.Product;
import com.salon.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/v1/products") @RequiredArgsConstructor @Tag(name="Products")
public class ProductController {
    private final ProductService service;
    @GetMapping  public ResponseEntity<ApiResponse<Page<Product>>> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){ return ResponseEntity.ok(ApiResponse.ok(service.findAll(page,size))); }
    @GetMapping("/low-stock") public ResponseEntity<ApiResponse<List<Product>>> lowStock(){ return ResponseEntity.ok(ApiResponse.ok(service.getLowStock())); }
    @PostMapping public ResponseEntity<ApiResponse<Product>> create(@RequestBody Product p){ return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.save(p))); }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<Product>> update(@PathVariable Long id,@RequestBody Product p){ return ResponseEntity.ok(ApiResponse.ok(service.update(id,p))); }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){ service.delete(id); return ResponseEntity.ok(ApiResponse.ok("Deleted",null)); }
}
