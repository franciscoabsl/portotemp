package com.portotemp.api.dto;

import com.portotemp.api.domain.limpeza.Limpeza;
import com.portotemp.api.domain.limpeza.StatusLimpeza;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record LimpezaResponse(
    UUID id,
    UUID reservaId,
    String imovelNome,
    String hospedeNome,
    LocalDate dataCheckin,
    LocalDate dataCheckout,
    LocalDate data,
    BigDecimal valorPago,
    StatusLimpeza status,
    UUID prestadorId,
    String prestadorNome
) {
    public static LimpezaResponse from(Limpeza l) {
        return new LimpezaResponse(
                l.getId(),
                l.getReserva().getId(),
                l.getReserva().getImovel().getNome(),
                l.getReserva().getHospede().getNome(),
                l.getReserva().getDataCheckin(),
                l.getReserva().getDataCheckout(),
                l.getData(),
                l.getValorPago(),
                l.getStatus(),
                l.getPrestador() != null ? l.getPrestador().getId() : null,
                l.getPrestador() != null ? l.getPrestador().getNome() : null
        );
    }
}
