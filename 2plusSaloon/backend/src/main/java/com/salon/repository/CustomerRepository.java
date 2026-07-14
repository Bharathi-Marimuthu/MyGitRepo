package com.salon.repository;
import com.salon.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.*;
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {}
