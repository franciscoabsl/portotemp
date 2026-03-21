package com.portotemp.api.dto;

import com.portotemp.api.domain.despesa.StatusPagamento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record DespesaRequest(

    @NotNull(message = "Imóvel é obrigatório")
    UUID imovelId,

    @NotBlank(message = "Tipo é obrigatório")
    String tipo,

    String descricao,

    @NotNull(message = "Valor é obrigatório")
    BigDecimal valor,

    @NotNull(message = "Competência é obrigatória")
    LocalDate competencia,

    StatusPagamento statusPagamento
) {}
