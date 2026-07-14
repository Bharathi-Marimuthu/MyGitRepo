package com.salon.controller;
import com.salon.dto.response.ApiResponse;
import com.salon.entity.Service;
import com.salon.service.ServiceManagementService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/services") @RequiredArgsConstructor @Tag(name="Services")
public class ServiceController {
    private final ServiceManagementService svc;
    @GetMapping  public ResponseEntity<ApiResponse<Page<Service>>> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="50") int size){ return ResponseEntity.ok(ApiResponse.ok(svc.findAll(page,size))); }
    @PostMapping public ResponseEntity<ApiResponse<Service>> create(@RequestBody Service s){ return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(svc.save(s))); }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<Service>> update(@PathVariable Long id,@RequestBody Service s){ return ResponseEntity.ok(ApiResponse.ok(svc.update(id,s))); }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){ svc.delete(id); return ResponseEntity.ok(ApiResponse.ok("Deleted",null)); }
}
