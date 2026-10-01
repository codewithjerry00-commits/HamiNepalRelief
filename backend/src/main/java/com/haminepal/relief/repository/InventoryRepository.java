package com.haminepal.relief.repository;

import com.haminepal.relief.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByWarehouseIdAndItemId(Long warehouseId, Long itemId);

    List<Inventory> findByWarehouseId(Long warehouseId);

    List<Inventory> findByItemId(Long itemId);

    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minimumStockLevel")
    List<Inventory> findLowStockItems();

    @Query("SELECT SUM(i.quantity) FROM Inventory i")
    Long sumTotalQuantity();

    @Query("SELECT i FROM Inventory i WHERE " +
           "(:warehouseId IS NULL OR i.warehouse.id = :warehouseId) AND " +
           "(:category IS NULL OR LOWER(i.item.category) = LOWER(:category)) AND " +
           "(:search IS NULL OR LOWER(i.item.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.warehouse.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Inventory> filterInventory(@Param("warehouseId") Long warehouseId,
                                    @Param("category") String category,
                                    @Param("search") String search);
}
