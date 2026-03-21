package com.portotemp.api.controller;

import com.portotemp.api.dto.HospedeRequest;
import com.portotemp.api.dto.HospedeResponse;
import com.portotemp.api.service.HospedeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/hospedes")
@RequiredArgsConstructor
public class HospedeController {

    private final HospedeService hospedeService;

    @GetMapping
    public ResponseEntity<List<HospedeResponse>> listar() {
        return ResponseEntity.ok(hospedeService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospedeResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(hospedeService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<HospedeResponse> criar(@Valid @RequestBody HospedeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hospedeService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HospedeResponse> atualizar(@PathVariable UUID id,
                                                      @Valid @RequestBody HospedeRequest request) {
        return ResponseEntity.ok(hospedeService.atualizar(id, request));
    }
}
