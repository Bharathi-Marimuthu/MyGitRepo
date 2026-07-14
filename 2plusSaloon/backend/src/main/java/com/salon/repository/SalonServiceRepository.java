package com.salon.repository;
import com.salon.entity.SalonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SalonServiceRepository extends JpaRepository<SalonService, Long> {
    Page<SalonService> findByStatusTrue(Pageable pageable);
}
