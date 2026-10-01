package com.haminepal.relief.service;

import com.haminepal.relief.dto.DispatchRequestDTO;
import com.haminepal.relief.exception.InsufficientStockException;
import com.haminepal.relief.exception.ResourceNotFoundException;
import com.haminepal.relief.model.*;
import com.haminepal.relief.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DispatchService {

    private final DispatchRepository dispatchRepository;
    private final WarehouseRepository warehouseRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final ItemRepository itemRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;

    public List<Dispatch> getAllDispatches() {
        return dispatchRepository.findAllByOrderByDispatchDateTimeDesc();
    }

    public Dispatch getDispatchById(Long id) {
        return dispatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch not found with ID: " + id));
    }

    @Transactional
    public Dispatch createDispatch(DispatchRequestDTO dto) {
        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with ID: " + dto.getWarehouseId()));

        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + dto.getVehicleId()));

        Driver driver = driverRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + dto.getDriverId()));

        // 1. Validate Stock Sufficiency for all requested items FIRST
        for (DispatchRequestDTO.DispatchItemRequestDTO itemReq : dto.getItems()) {
            Item item = itemRepository.findById(itemReq.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemReq.getItemId()));

            Inventory inventory = inventoryRepository.findByWarehouseIdAndItemId(warehouse.getId(), item.getId())
                    .orElseThrow(() -> new InsufficientStockException(
                            "Item '" + item.getName() + "' is not available in warehouse '" + warehouse.getName() + "'"));

            if (inventory.getQuantity() < itemReq.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for item '" + item.getName() + "'. Available: " +
                        inventory.getQuantity() + " " + item.getUnit() + ", Requested: " +
                        itemReq.getQuantity() + " " + item.getUnit());
            }
        }

        // 2. Build Dispatch Header
        Dispatch dispatch = Dispatch.builder()
                .warehouse(warehouse)
                .vehicle(vehicle)
                .driver(driver)
                .destination(dto.getDestination())
                .recipient(dto.getRecipient())
                .dispatchDateTime(LocalDateTime.now())
                .notes(dto.getNotes())
                .status(Dispatch.DispatchStatus.IN_TRANSIT)
                .items(new ArrayList<>())
                .build();

        // 3. Process items & update stock
        for (DispatchRequestDTO.DispatchItemRequestDTO itemReq : dto.getItems()) {
            Item item = itemRepository.findById(itemReq.getItemId()).get();
            Inventory inventory = inventoryRepository.findByWarehouseIdAndItemId(warehouse.getId(), item.getId()).get();

            // Deduct inventory
            inventory.setQuantity(inventory.getQuantity() - itemReq.getQuantity());
            inventoryRepository.save(inventory);

            // Create DispatchItem
            DispatchItem dispatchItem = DispatchItem.builder()
                    .dispatch(dispatch)
                    .item(item)
                    .quantity(itemReq.getQuantity())
                    .unit(item.getUnit())
                    .build();
            dispatch.getItems().add(dispatchItem);

            // Log Inventory Transaction
            InventoryTransaction transaction = InventoryTransaction.builder()
                    .warehouse(warehouse)
                    .item(item)
                    .transactionType(InventoryTransaction.TransactionType.DISPATCHED)
                    .quantity(itemReq.getQuantity())
                    .notes("Dispatched to " + dto.getDestination() + " (Recipient: " + dto.getRecipient() + ")")
                    .build();
            transactionRepository.save(transaction);
        }

        return dispatchRepository.save(dispatch);
    }
}
