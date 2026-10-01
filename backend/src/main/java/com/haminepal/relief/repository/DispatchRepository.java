package com.haminepal.relief.repository;

import com.haminepal.relief.model.Dispatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DispatchRepository extends JpaRepository<Dispatch, Long> {

    List<Dispatch> findAllByOrderByDispatchDateTimeDesc();

    List<Dispatch> findTop5ByOrderByDispatchDateTimeDesc();

    @Query("SELECT d FROM Dispatch d WHERE " +
           "(:warehouseId IS NULL OR d.warehouse.id = :warehouseId) AND " +
           "(:vehicleId IS NULL OR d.vehicle.id = :vehicleId) AND " +
           "(:driverId IS NULL OR d.driver.id = :driverId) AND " +
           "(:startDate IS NULL OR d.dispatchDateTime >= :startDate) AND " +
           "(:endDate IS NULL OR d.dispatchDateTime <= :endDate) AND " +
           "(:destination IS NULL OR LOWER(d.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) " +
           "ORDER BY d.dispatchDateTime DESC")
    List<Dispatch> filterDispatches(@Param("warehouseId") Long warehouseId,
                                    @Param("vehicleId") Long vehicleId,
                                    @Param("driverId") Long driverId,
                                    @Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate,
                                    @Param("destination") String destination);

    boolean existsByWarehouseId(Long warehouseId);
    boolean existsByVehicleId(Long vehicleId);
    boolean existsByDriverId(Long driverId);
}
