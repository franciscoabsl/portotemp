package com.portotemp.api.controller;

import com.portotemp.api.domain.reserva.StatusReserva;
import com.portotemp.api.dto.ReservaRequest;
import com.portotemp.api.dto.ReservaResponse;
import com.portotemp.api.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @GetMapping
    public ResponseEntity<List<ReservaResponse>> listar() {
        return ResponseEntity.ok(reservaService.listar());
    }

    @GetMapping("/imovel/{imovelId}")
    public ResponseEntity<List<ReservaResponse>> listarPorImovel(@PathVariable UUID imovelId) {
        return ResponseEntity.ok(reservaService.listarPorImovel(imovelId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(reservaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ReservaResponse> criar(@Valid @RequestBody ReservaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponse> atualizar(@PathVariable UUID id,
                                                      @Valid @RequestBody ReservaRequest request) {
        return ResponseEntity.ok(reservaService.atualizar(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReservaResponse> atualizarStatus(@PathVariable UUID id,
                                                            @RequestParam StatusReserva status) {
        return ResponseEntity.ok(reservaService.atualizarStatus(id, status));
    }
}
