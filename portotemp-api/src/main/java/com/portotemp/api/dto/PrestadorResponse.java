package com.portotemp.api.dto;

import com.portotemp.api.domain.prestador.Prestador;
import com.portotemp.api.domain.prestador.TipoPrestador;

import java.util.UUID;

public record PrestadorResponse(
    UUID id,
    String nome,
    String telefone,
    TipoPrestador tipo,
    UUID imovelId,
    String imovelNome,
    Boolean ativo
) {
    public static PrestadorResponse from(Prestador p) {
        return new PrestadorResponse(
                p.getId(),
                p.getNome(),
                p.getTelefone(),
                p.getTipo(),
                p.getImovel().getId(),
                p.getImovel().getNome(),
                p.getAtivo()
        );
    }
}
