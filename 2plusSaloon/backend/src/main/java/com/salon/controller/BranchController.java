package com.salon.controller;
import com.salon.dto.response.ApiResponse;
import com.salon.entity.Branch;
import com.salon.service.BranchService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/branches") @RequiredArgsConstructor @Tag(name="Branches")
public class BranchController {
    private final BranchService service;
    @GetMapping  public ResponseEntity<ApiResponse<Page<Branch>>> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size)
    { return ResponseEntity.ok(ApiResponse.ok(service.findAll(page,size))); }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<Branch>> get(@PathVariable Long id){ return ResponseEntity.ok(ApiResponse.ok(service.findById(id))); }
    @PostMapping public ResponseEntity<ApiResponse<Branch>> create(@RequestBody Branch b){
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Branch created",service.save(b)));
    }

    @PutMapping("/{id}") public ResponseEntity<ApiResponse<Branch>> update(@PathVariable Long id,@RequestBody Branch b){ return ResponseEntity.ok(ApiResponse.ok(service.update(id,b))); }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){ service.delete(id); return ResponseEntity.ok(ApiResponse.ok("Deleted",null)); }
}
