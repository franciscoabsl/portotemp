package com.portotemp.api.controller;

import com.portotemp.api.dto.LavanderiaResponse;
import com.portotemp.api.dto.LimpezaRequest;
import com.portotemp.api.dto.LimpezaResponse;
import com.portotemp.api.service.LimpezaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reservas/{reservaId}")
@RequiredArgsConstructor
public class LimpezaController {

    private final LimpezaService limpezaService;

    @GetMapping("/limpeza")
    public ResponseEntity<LimpezaResponse> buscarLimpeza(@PathVariable UUID reservaId) {
        return ResponseEntity.ok(limpezaService.buscarPorReserva(reservaId));
    }

    @PutMapping("/limpeza")
    public ResponseEntity<LimpezaResponse> atualizarLimpeza(@PathVariable UUID reservaId,
                                                              @Valid @RequestBody LimpezaRequest request) {
        return ResponseEntity.ok(limpezaService.atualizarLimpeza(reservaId, request));
    }

    @PatchMapping("/limpeza/concluir")
    public ResponseEntity<LimpezaResponse> concluirLimpeza(@PathVariable UUID reservaId) {
        return ResponseEntity.ok(limpezaService.concluirLimpeza(reservaId));
    }

    @PostMapping("/lavanderia")
    public ResponseEntity<LavanderiaResponse> registrarLavanderia(@PathVariable UUID reservaId,
                                                                    @Valid @RequestBody LimpezaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(limpezaService.registrarLavanderia(reservaId, request));
    }

    @GetMapping("/lavanderia")
    public ResponseEntity<LavanderiaResponse> buscarLavanderia(@PathVariable UUID reservaId) {
        return ResponseEntity.ok(limpezaService.buscarLavanderiaPorReserva(reservaId));
    }
}
