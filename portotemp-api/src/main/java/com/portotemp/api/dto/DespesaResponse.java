package com.portotemp.api.dto;

import com.portotemp.api.domain.despesa.Despesa;
import com.portotemp.api.domain.despesa.StatusPagamento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record DespesaResponse(
    UUID id,
    UUID imovelId,
    String imovelNome,
    String tipo,
    String descricao,
    BigDecimal valor,
    LocalDate competencia,
    StatusPagamento statusPagamento,
    LocalDateTime criadoEm
) {
    public static DespesaResponse from(Despesa d) {
        return new DespesaResponse(
                d.getId(),
                d.getImovel().getId(),
                d.getImovel().getNome(),
                d.getTipo(),
                d.getDescricao(),
                d.getValor(),
                d.getCompetencia(),
                d.getStatusPagamento(),
                d.getCriadoEm()
        );
    }
}
