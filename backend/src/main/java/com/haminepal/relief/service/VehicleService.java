package com.haminepal.relief.service;

import com.haminepal.relief.exception.ResourceInUseException;
import com.haminepal.relief.exception.ResourceNotFoundException;
import com.haminepal.relief.model.Vehicle;
import com.haminepal.relief.repository.DispatchRepository;
import com.haminepal.relief.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DispatchRepository dispatchRepository;

    public List<Vehicle> getAllActiveVehicles() {
        return vehicleRepository.findByActiveTrue();
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
    }

    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByVehicleNumberIgnoreCase(vehicle.getVehicleNumber())) {
            throw new IllegalArgumentException("Vehicle number '" + vehicle.getVehicleNumber() + "' already exists");
        }
        vehicle.setActive(true);
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle details) {
        Vehicle vehicle = getVehicleById(id);

        if (!vehicle.getVehicleNumber().equalsIgnoreCase(details.getVehicleNumber()) &&
            vehicleRepository.existsByVehicleNumberIgnoreCase(details.getVehicleNumber())) {
            throw new IllegalArgumentException("Vehicle number '" + details.getVehicleNumber() + "' already exists");
        }

        vehicle.setVehicleNumber(details.getVehicleNumber());
        vehicle.setVehicleType(details.getVehicleType());
        vehicle.setCapacity(details.getCapacity());
        vehicle.setDescription(details.getDescription());

        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        if (dispatchRepository.existsByVehicleId(id)) {
            // Soft delete if used in dispatches
            vehicle.setActive(false);
            vehicleRepository.save(vehicle);
        } else {
            // Hard delete if never used
            vehicleRepository.delete(vehicle);
        }
    }
}
