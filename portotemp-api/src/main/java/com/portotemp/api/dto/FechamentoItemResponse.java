package com.portotemp.api.dto;

import com.portotemp.api.domain.fechamento.FechamentoItem;
import com.portotemp.api.domain.fechamento.TipoItemFechamento;

import java.math.BigDecimal;
import java.util.UUID;

public record FechamentoItemResponse(
    UUID id,
    TipoItemFechamento tipo,
    UUID referenciaId,
    String descricao,
    BigDecimal valor
) {
    public static FechamentoItemResponse from(FechamentoItem i) {
        return new FechamentoItemResponse(
                i.getId(),
                i.getTipo(),
                i.getReferenciaId(),
                i.getDescricao(),
                i.getValor()
        );
    }
}
