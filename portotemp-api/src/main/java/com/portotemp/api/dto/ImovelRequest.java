package com.portotemp.api.dto;

import com.portotemp.api.domain.imovel.BaseCalculoComissao;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record ImovelRequest(

    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @NotNull(message = "Proprietário é obrigatório")
    UUID proprietarioId,

    String endereco,

    String codigoFechadura,

    BigDecimal taxaLimpezaHospede,

    @NotNull(message = "Base de cálculo é obrigatória")
    BaseCalculoComissao baseCalculoComissao,

    @NotNull(message = "Percentual de comissão é obrigatório")
    @DecimalMin(value = "0.0", message = "Percentual deve ser maior ou igual a 0")
    @DecimalMax(value = "100.0", message = "Percentual deve ser menor ou igual a 100")
    BigDecimal percentualComissao,

    Boolean respLimpeza,
    Boolean respLavanderia,
    Boolean respDespesas
) {}
