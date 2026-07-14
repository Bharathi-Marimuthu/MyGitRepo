package com.salon.repository;
import com.salon.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository public interface ExpenseRepository extends JpaRepository<Expense, Long> {}
