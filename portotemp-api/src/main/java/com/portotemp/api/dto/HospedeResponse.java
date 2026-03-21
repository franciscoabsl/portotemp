package com.portotemp.api.dto;

import com.portotemp.api.domain.hospede.Hospede;

import java.time.LocalDateTime;
import java.util.UUID;

public record HospedeResponse(
    UUID id,
    String nome,
    String telefone,
    String email,
    LocalDateTime criadoEm
) {
    public static HospedeResponse from(Hospede h) {
        return new HospedeResponse(
                h.getId(),
                h.getNome(),
                h.getTelefone(),
                h.getEmail(),
                h.getCriadoEm()
        );
    }
}
