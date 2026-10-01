package com.haminepal.relief.controller;

import com.haminepal.relief.dto.DispatchRequestDTO;
import com.haminepal.relief.model.Dispatch;
import com.haminepal.relief.service.DispatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispatches")
@RequiredArgsConstructor
public class DispatchController {

    private final DispatchService dispatchService;

    @GetMapping
    public ResponseEntity<List<Dispatch>> getAllDispatches() {
        return ResponseEntity.ok(dispatchService.getAllDispatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispatch> getDispatchById(@PathVariable Long id) {
        return ResponseEntity.ok(dispatchService.getDispatchById(id));
    }

    @PostMapping
    public ResponseEntity<Dispatch> createDispatch(@Valid @RequestBody DispatchRequestDTO dto) {
        return new ResponseEntity<>(dispatchService.createDispatch(dto), HttpStatus.CREATED);
    }
}
