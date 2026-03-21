package com.portotemp.api.dto;

import com.portotemp.api.domain.limpeza.Lavanderia;
import com.portotemp.api.domain.limpeza.StatusLimpeza;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record LavanderiaResponse(
    UUID id,
    UUID reservaId,
    String imovelNome,
    String hospedeNome,
    LocalDate data,
    BigDecimal valorPago,
    StatusLimpeza status,
    UUID prestadorId,
    String prestadorNome
) {
    public static LavanderiaResponse from(Lavanderia l) {
        return new LavanderiaResponse(
                l.getId(),
                l.getReserva().getId(),
                l.getReserva().getImovel().getNome(),
                l.getReserva().getHospede().getNome(),
                l.getData(),
                l.getValorPago(),
                l.getStatus(),
                l.getPrestador() != null ? l.getPrestador().getId() : null,
                l.getPrestador() != null ? l.getPrestador().getNome() : null
        );
    }
}
