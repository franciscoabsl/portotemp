package com.portotemp.api.dto;

import java.util.UUID;

public record AuthResponse(
    String token,
    String nome,
    String email,
    String role,
    UUID tenantId
) {}
