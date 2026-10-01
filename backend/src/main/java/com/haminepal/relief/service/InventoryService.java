package com.haminepal.relief.service;

import com.haminepal.relief.dto.StockReceiveDTO;
import com.haminepal.relief.exception.ResourceNotFoundException;
import com.haminepal.relief.model.Inventory;
import com.haminepal.relief.model.InventoryTransaction;
import com.haminepal.relief.model.Item;
import com.haminepal.relief.model.Warehouse;
import com.haminepal.relief.repository.InventoryRepository;
import com.haminepal.relief.repository.InventoryTransactionRepository;
import com.haminepal.relief.repository.ItemRepository;
import com.haminepal.relief.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final WarehouseRepository warehouseRepository;
    private final ItemRepository itemRepository;

    public List<Inventory> getAllInventory(Long warehouseId, String category, String search) {
        return inventoryRepository.filterInventory(warehouseId, category, search);
    }

    public List<Inventory> getInventoryByWarehouse(Long warehouseId) {
        return inventoryRepository.findByWarehouseId(warehouseId);
    }

    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    public List<InventoryTransaction> getTransactionHistory() {
        return transactionRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Inventory receiveStock(StockReceiveDTO dto) {
        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with ID: " + dto.getWarehouseId()));

        Item item = itemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + dto.getItemId()));

        Inventory inventory = inventoryRepository.findByWarehouseIdAndItemId(warehouse.getId(), item.getId())
                .orElseGet(() -> Inventory.builder()
                        .warehouse(warehouse)
                        .item(item)
                        .quantity(0)
                        .minimumStockLevel(dto.getMinimumStockLevel() != null ? dto.getMinimumStockLevel() : 10)
                        .build());

        inventory.setQuantity(inventory.getQuantity() + dto.getQuantity());
        if (dto.getMinimumStockLevel() != null) {
            inventory.setMinimumStockLevel(dto.getMinimumStockLevel());
        }

        Inventory saved = inventoryRepository.save(inventory);

        // Record Transaction
        InventoryTransaction transaction = InventoryTransaction.builder()
                .warehouse(warehouse)
                .item(item)
                .transactionType(InventoryTransaction.TransactionType.RECEIVED)
                .quantity(dto.getQuantity())
                .notes(dto.getNotes() != null ? dto.getNotes() : "Stock received into warehouse")
                .build();
        transactionRepository.save(transaction);

        return saved;
    }
}
