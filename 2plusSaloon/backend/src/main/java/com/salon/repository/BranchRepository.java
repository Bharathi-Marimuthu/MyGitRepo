package com.salon.repository;
import com.salon.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.*;
@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {}
