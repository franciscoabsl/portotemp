package com.portotemp.api.dto;

import com.portotemp.api.domain.fechamento.Fechamento;
import com.portotemp.api.domain.fechamento.StatusFechamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record FechamentoResponse(
    UUID id,
    UUID proprietarioId,
    String proprietarioNome,
    Integer mes,
    Integer ano,
    BigDecimal totalComissao,
    BigDecimal totalReembolsos,
    BigDecimal totalAReceber,
    StatusFechamento status,
    LocalDateTime geradoEm,
    List<FechamentoItemResponse> itens
) {
    public static FechamentoResponse from(Fechamento f) {
        return new FechamentoResponse(
                f.getId(),
                f.getProprietario().getId(),
                f.getProprietario().getNome(),
                f.getMes(),
                f.getAno(),
                f.getTotalComissao(),
                f.getTotalReembolsos(),
                f.getTotalAReceber(),
                f.getStatus(),
                f.getGeradoEm(),
                f.getItens().stream().map(FechamentoItemResponse::from).toList()
        );
    }
}
