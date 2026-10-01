package com.haminepal.relief.dto;

import com.haminepal.relief.model.Dispatch;
import com.haminepal.relief.model.Inventory;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryDTO {

    private long totalWarehouses;
    private long totalItems;
    private long totalVehicles;
    private long totalDrivers;
    private long totalDispatches;
    private long totalStockQuantity;
    private long lowStockCount;
    private List<Inventory> lowStockItems;
    private List<Dispatch> recentDispatches;
}
