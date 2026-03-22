package com.portotemp.api.controller;

import com.portotemp.api.dto.CancelamentoRequest;
import com.portotemp.api.dto.CancelamentoResponse;
import com.portotemp.api.service.CancelamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reservas/{reservaId}/cancelamento")
@RequiredArgsConstructor
public class CancelamentoController {

    private final CancelamentoService cancelamentoService;

    @GetMapping
    public ResponseEntity<CancelamentoResponse> buscar(@PathVariable UUID reservaId) {
        return ResponseEntity.ok(cancelamentoService.buscarPorReserva(reservaId));
    }

    @PostMapping
    public ResponseEntity<CancelamentoResponse> cancelar(@PathVariable UUID reservaId,
                                                          @RequestBody CancelamentoRequest request) {
        return ResponseEntity.ok(cancelamentoService.cancelar(reservaId, request));
    }
}
