package com.portotemp.api.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record LimpezaRequest(

    @NotNull(message = "Data é obrigatória")
    LocalDate data,

    BigDecimal valorPago,

    UUID prestadorId
) {}
