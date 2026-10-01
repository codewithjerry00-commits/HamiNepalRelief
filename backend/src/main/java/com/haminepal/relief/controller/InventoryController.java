package com.haminepal.relief.controller;

import com.haminepal.relief.dto.StockReceiveDTO;
import com.haminepal.relief.model.Inventory;
import com.haminepal.relief.model.InventoryTransaction;
import com.haminepal.relief.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory(
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(inventoryService.getAllInventory(warehouseId, category, search));
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<Inventory>> getInventoryByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(inventoryService.getInventoryByWarehouse(warehouseId));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Inventory>> getLowStockItems() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<InventoryTransaction>> getTransactionHistory() {
        return ResponseEntity.ok(inventoryService.getTransactionHistory());
    }

    @PostMapping("/receive")
    public ResponseEntity<Inventory> receiveStock(@Valid @RequestBody StockReceiveDTO dto) {
        return new ResponseEntity<>(inventoryService.receiveStock(dto), HttpStatus.CREATED);
    }
}
