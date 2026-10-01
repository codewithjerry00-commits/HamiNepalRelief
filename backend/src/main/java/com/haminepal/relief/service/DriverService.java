package com.haminepal.relief.service;

import com.haminepal.relief.exception.ResourceNotFoundException;
import com.haminepal.relief.model.Driver;
import com.haminepal.relief.repository.DispatchRepository;
import com.haminepal.relief.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;
    private final DispatchRepository dispatchRepository;

    public List<Driver> getAllActiveDrivers() {
        return driverRepository.findByActiveTrue();
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + id));
    }

    @Transactional
    public Driver createDriver(Driver driver) {
        driver.setActive(true);
        return driverRepository.save(driver);
    }

    @Transactional
    public Driver updateDriver(Long id, Driver details) {
        Driver driver = getDriverById(id);
        driver.setName(details.getName());
        driver.setPhone(details.getPhone());
        driver.setLicenseNumber(details.getLicenseNumber());
        driver.setDescription(details.getDescription());
        return driverRepository.save(driver);
    }

    @Transactional
    public void deleteDriver(Long id) {
        Driver driver = getDriverById(id);
        if (dispatchRepository.existsByDriverId(id)) {
            // Soft delete if used in dispatches
            driver.setActive(false);
            driverRepository.save(driver);
        } else {
            // Hard delete if never used
            driverRepository.delete(driver);
        }
    }
}
