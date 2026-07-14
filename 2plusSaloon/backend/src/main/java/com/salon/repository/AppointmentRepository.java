package com.salon.repository;
import com.salon.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.*;
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {}
