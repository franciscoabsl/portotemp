package com.portotemp.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CancelamentoRequest(
    BigDecimal valorMulta,
    String motivo,
    LocalDate dataCancelamento
) {}
