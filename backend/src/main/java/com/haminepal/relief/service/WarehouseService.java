package com.haminepal.relief.service;

import com.haminepal.relief.exception.ResourceInUseException;
import com.haminepal.relief.exception.ResourceNotFoundException;
import com.haminepal.relief.model.Warehouse;
import com.haminepal.relief.repository.DispatchRepository;
import com.haminepal.relief.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final DispatchRepository dispatchRepository;

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Warehouse getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with ID: " + id));
    }

    @Transactional
    public Warehouse createWarehouse(Warehouse warehouse) {
        if (warehouseRepository.existsByNameIgnoreCase(warehouse.getName())) {
            throw new IllegalArgumentException("Warehouse with name '" + warehouse.getName() + "' already exists");
        }
        return warehouseRepository.save(warehouse);
    }

    @Transactional
    public Warehouse updateWarehouse(Long id, Warehouse details) {
        Warehouse warehouse = getWarehouseById(id);
        
        if (!warehouse.getName().equalsIgnoreCase(details.getName()) &&
            warehouseRepository.existsByNameIgnoreCase(details.getName())) {
            throw new IllegalArgumentException("Warehouse with name '" + details.getName() + "' already exists");
        }

        warehouse.setName(details.getName());
        warehouse.setLocation(details.getLocation());
        warehouse.setContactPerson(details.getContactPerson());
        warehouse.setContactNumber(details.getContactNumber());
        warehouse.setDescription(details.getDescription());

        return warehouseRepository.save(warehouse);
    }

    @Transactional
    public void deleteWarehouse(Long id) {
        Warehouse warehouse = getWarehouseById(id);
        if (dispatchRepository.existsByWarehouseId(id)) {
            throw new ResourceInUseException("Cannot delete warehouse with existing dispatch records");
        }
        warehouseRepository.delete(warehouse);
    }
}
