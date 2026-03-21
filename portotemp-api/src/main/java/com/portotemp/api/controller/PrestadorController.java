package com.portotemp.api.controller;

import com.portotemp.api.dto.PrestadorRequest;
import com.portotemp.api.dto.PrestadorResponse;
import com.portotemp.api.service.PrestadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/prestadores")
@RequiredArgsConstructor
public class PrestadorController {

    private final PrestadorService prestadorService;

    @GetMapping
    public ResponseEntity<List<PrestadorResponse>> listar() {
        return ResponseEntity.ok(prestadorService.listar());
    }

    @GetMapping("/imovel/{imovelId}")
    public ResponseEntity<List<PrestadorResponse>> listarPorImovel(@PathVariable UUID imovelId) {
        return ResponseEntity.ok(prestadorService.listarPorImovel(imovelId));
    }

    @PostMapping
    public ResponseEntity<PrestadorResponse> criar(@Valid @RequestBody PrestadorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(prestadorService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrestadorResponse> atualizar(@PathVariable UUID id,
                                                        @Valid @RequestBody PrestadorRequest request) {
        return ResponseEntity.ok(prestadorService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable UUID id) {
        prestadorService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
