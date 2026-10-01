package com.haminepal.relief.service;

import com.haminepal.relief.dto.DashboardSummaryDTO;
import com.haminepal.relief.model.Inventory;
import com.haminepal.relief.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final WarehouseRepository warehouseRepository;
    private final ItemRepository itemRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final DispatchRepository dispatchRepository;
    private final InventoryRepository inventoryRepository;

    public DashboardSummaryDTO getDashboardSummary() {
        Long totalStock = inventoryRepository.sumTotalQuantity();
        List<Inventory> lowStockItems = inventoryRepository.findLowStockItems();

        return DashboardSummaryDTO.builder()
                .totalWarehouses(warehouseRepository.count())
                .totalItems(itemRepository.count())
                .totalVehicles(vehicleRepository.findByActiveTrue().size())
                .totalDrivers(driverRepository.findByActiveTrue().size())
                .totalDispatches(dispatchRepository.count())
                .totalStockQuantity(totalStock != null ? totalStock : 0)
                .lowStockCount(lowStockItems.size())
                .lowStockItems(lowStockItems)
                .recentDispatches(dispatchRepository.findTop5ByOrderByDispatchDateTimeDesc())
                .build();
    }
}
