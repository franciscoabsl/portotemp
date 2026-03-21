package com.portotemp.api.controller;

import com.portotemp.api.dto.ProprietarioRequest;
import com.portotemp.api.dto.ProprietarioResponse;
import com.portotemp.api.service.ProprietarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/proprietarios")
@RequiredArgsConstructor
public class ProprietarioController {

    private final ProprietarioService proprietarioService;

    @GetMapping
    public ResponseEntity<List<ProprietarioResponse>> listar() {
        return ResponseEntity.ok(proprietarioService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProprietarioResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(proprietarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProprietarioResponse> criar(@Valid @RequestBody ProprietarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(proprietarioService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProprietarioResponse> atualizar(@PathVariable UUID id,
                                                          @Valid @RequestBody ProprietarioRequest request) {
        return ResponseEntity.ok(proprietarioService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable UUID id) {
        proprietarioService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
