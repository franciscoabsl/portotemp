package com.portotemp.api.controller;

import com.portotemp.api.dto.DespesaRequest;
import com.portotemp.api.dto.DespesaResponse;
import com.portotemp.api.service.DespesaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/despesas")
@RequiredArgsConstructor
public class DespesaController {

    private final DespesaService despesaService;

    @GetMapping
    public ResponseEntity<List<DespesaResponse>> listar() {
        return ResponseEntity.ok(despesaService.listar());
    }

    @GetMapping("/imovel/{imovelId}")
    public ResponseEntity<List<DespesaResponse>> listarPorImovel(@PathVariable UUID imovelId) {
        return ResponseEntity.ok(despesaService.listarPorImovel(imovelId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DespesaResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(despesaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<DespesaResponse> criar(@Valid @RequestBody DespesaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(despesaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DespesaResponse> atualizar(@PathVariable UUID id,
                                                      @Valid @RequestBody DespesaRequest request) {
        return ResponseEntity.ok(despesaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        despesaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
