package com.portotemp.api.dto;

import com.portotemp.api.domain.proprietario.Proprietario;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProprietarioResponse(
    UUID id,
    String nome,
    String email,
    String telefone,
    String cpfCnpj,
    Boolean ativo,
    LocalDateTime criadoEm
) {
    public static ProprietarioResponse from(Proprietario p) {
        return new ProprietarioResponse(
                p.getId(),
                p.getNome(),
                p.getEmail(),
                p.getTelefone(),
                p.getCpfCnpj(),
                p.getAtivo(),
                p.getCriadoEm()
        );
    }
}
