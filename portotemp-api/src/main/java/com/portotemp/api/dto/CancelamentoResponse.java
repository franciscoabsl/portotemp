package com.portotemp.api.dto;

import com.portotemp.api.domain.cancelamento.Cancelamento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record CancelamentoResponse(
    UUID id,
    UUID reservaId,
    String hospedeNome,
    String imovelNome,
    LocalDate dataCancelamento,
    BigDecimal valorMulta,
    String motivo,
    LocalDateTime criadoEm
) {
    public static CancelamentoResponse from(Cancelamento c) {
        return new CancelamentoResponse(
                c.getId(),
                c.getReserva().getId(),
                c.getReserva().getHospede().getNome(),
                c.getReserva().getImovel().getNome(),
                c.getDataCancelamento(),
                c.getValorMulta(),
                c.getMotivo(),
                c.getCriadoEm()
        );
    }
}
