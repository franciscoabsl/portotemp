package com.portotemp.api.controller;

import com.portotemp.api.dto.ImovelRequest;
import com.portotemp.api.dto.ImovelResponse;
import com.portotemp.api.service.ImovelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/imoveis")
@RequiredArgsConstructor
public class ImovelController {

    private final ImovelService imovelService;

    @GetMapping
    public ResponseEntity<List<ImovelResponse>> listar() {
        return ResponseEntity.ok(imovelService.listar());
    }

    @GetMapping("/proprietario/{proprietarioId}")
    public ResponseEntity<List<ImovelResponse>> listarPorProprietario(@PathVariable UUID proprietarioId) {
        return ResponseEntity.ok(imovelService.listarPorProprietario(proprietarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImovelResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(imovelService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ImovelResponse> criar(@Valid @RequestBody ImovelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imovelService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImovelResponse> atualizar(@PathVariable UUID id,
                                                     @Valid @RequestBody ImovelRequest request) {
        return ResponseEntity.ok(imovelService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable UUID id) {
        imovelService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
