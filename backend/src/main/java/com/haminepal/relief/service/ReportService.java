package com.haminepal.relief.service;

import com.haminepal.relief.model.Dispatch;
import com.haminepal.relief.model.DispatchItem;
import com.haminepal.relief.model.Inventory;
import com.haminepal.relief.repository.DispatchRepository;
import com.haminepal.relief.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final DispatchRepository dispatchRepository;
    private final InventoryRepository inventoryRepository;

    public List<Dispatch> filterDispatches(Long warehouseId, Long vehicleId, Long driverId,
                                           LocalDateTime startDate, LocalDateTime endDate, String destination) {
        return dispatchRepository.filterDispatches(warehouseId, vehicleId, driverId, startDate, endDate, destination);
    }

    public byte[] exportDispatchesToExcel(Long warehouseId, Long vehicleId, Long driverId,
                                         LocalDateTime startDate, LocalDateTime endDate, String destination) throws IOException {
        List<Dispatch> dispatches = filterDispatches(warehouseId, vehicleId, driverId, startDate, endDate, destination);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Dispatch History");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columns = {"Dispatch ID", "Date & Time", "Warehouse", "Vehicle", "Driver", "Destination", "Recipient", "Status", "Items Dispatched"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

            int rowIdx = 1;
            for (Dispatch dispatch : dispatches) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(dispatch.getId());
                row.createCell(1).setCellValue(dispatch.getDispatchDateTime() != null ? dispatch.getDispatchDateTime().format(formatter) : "");
                row.createCell(2).setCellValue(dispatch.getWarehouse() != null ? dispatch.getWarehouse().getName() : "");
                row.createCell(3).setCellValue(dispatch.getVehicle() != null ? dispatch.getVehicle().getVehicleNumber() : "");
                row.createCell(4).setCellValue(dispatch.getDriver() != null ? dispatch.getDriver().getName() : "");
                row.createCell(5).setCellValue(dispatch.getDestination());
                row.createCell(6).setCellValue(dispatch.getRecipient());
                row.createCell(7).setCellValue(dispatch.getStatus() != null ? dispatch.getStatus().name() : "");

                String itemsSummary = dispatch.getItems().stream()
                        .map(item -> item.getItem().getName() + ": " + item.getQuantity() + " " + item.getUnit())
                        .collect(Collectors.joining("; "));
                row.createCell(8).setCellValue(itemsSummary);
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportInventoryToExcel() throws IOException {
        List<Inventory> inventoryList = inventoryRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Inventory Stock");

            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columns = {"ID", "Warehouse", "Item Name", "Category", "Quantity", "Unit", "Min Stock Level", "Stock Status"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Inventory inv : inventoryList) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(inv.getId());
                row.createCell(1).setCellValue(inv.getWarehouse() != null ? inv.getWarehouse().getName() : "");
                row.createCell(2).setCellValue(inv.getItem() != null ? inv.getItem().getName() : "");
                row.createCell(3).setCellValue(inv.getItem() != null ? inv.getItem().getCategory() : "");
                row.createCell(4).setCellValue(inv.getQuantity());
                row.createCell(5).setCellValue(inv.getItem() != null ? inv.getItem().getUnit() : "");
                row.createCell(6).setCellValue(inv.getMinimumStockLevel());
                row.createCell(7).setCellValue(inv.isLowStock() ? "LOW STOCK" : "NORMAL");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
