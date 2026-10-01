package com.haminepal.relief.repository;

import com.haminepal.relief.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Optional<Warehouse> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
