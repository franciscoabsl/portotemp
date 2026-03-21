package com.portotemp.api.dto;

import com.portotemp.api.domain.reserva.OrigemReserva;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ReservaRequest(

    @NotNull(message = "Imóvel é obrigatório")
    UUID imovelId,

    @NotNull(message = "Hóspede é obrigatório")
    UUID hospedeId,

    @NotNull(message = "Data de check-in é obrigatória")
    LocalDate dataCheckin,

    @NotNull(message = "Data de check-out é obrigatória")
    LocalDate dataCheckout,

    @NotNull(message = "Origem é obrigatória")
    OrigemReserva origem,

    @NotNull(message = "Valor total é obrigatório")
    BigDecimal valorTotal,

    BigDecimal taxaLimpezaHospede,

    @NotNull(message = "Número de pessoas é obrigatório")
    @Min(value = 1, message = "Mínimo de 1 pessoa")
    Integer numPessoas,

    String observacoes
) {}
