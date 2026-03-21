package com.portotemp.api.controller;

import com.portotemp.api.dto.FechamentoResponse;
import com.portotemp.api.service.FechamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/fechamentos")
@RequiredArgsConstructor
public class FechamentoController {

    private final FechamentoService fechamentoService;

    @GetMapping
    public ResponseEntity<List<FechamentoResponse>> listar() {
        return ResponseEntity.ok(fechamentoService.listar());
    }

    @GetMapping("/proprietario/{proprietarioId}")
    public ResponseEntity<List<FechamentoResponse>> listarPorProprietario(@PathVariable UUID proprietarioId) {
        return ResponseEntity.ok(fechamentoService.listarPorProprietario(proprietarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FechamentoResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(fechamentoService.buscarPorId(id));
    }

    @PostMapping("/gerar")
    public ResponseEntity<FechamentoResponse> gerar(
            @RequestParam UUID proprietarioId,
            @RequestParam int mes,
            @RequestParam int ano) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fechamentoService.gerar(proprietarioId, mes, ano));
    }

    @PatchMapping("/{id}/fechar")
    public ResponseEntity<FechamentoResponse> fechar(@PathVariable UUID id) {
        return ResponseEntity.ok(fechamentoService.fechar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        fechamentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
