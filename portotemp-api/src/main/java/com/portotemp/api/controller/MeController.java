package com.portotemp.api.controller;

import com.portotemp.api.domain.usuario.Usuario;
import com.portotemp.api.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/me")
@RequiredArgsConstructor
public class MeController {

    private final TenantService tenantService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(Map.of(
                "id", usuario.getId(),
                "nome", usuario.getNome(),
                "email", usuario.getEmail(),
                "role", usuario.getRole(),
                "tenantId", tenantService.getCurrentTenantId()
        ));
    }
}
