package com.haminepal.relief.repository;

import com.haminepal.relief.model.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByWarehouseId(Long warehouseId);
    List<InventoryTransaction> findByItemId(Long itemId);
    List<InventoryTransaction> findAllByOrderByCreatedAtDesc();
}
