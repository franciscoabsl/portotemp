package com.portotemp.api.dto;

import com.portotemp.api.domain.reserva.OrigemReserva;
import com.portotemp.api.domain.reserva.Reserva;
import com.portotemp.api.domain.reserva.StatusReserva;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReservaResponse(
    UUID id,
    UUID imovelId,
    String imovelNome,
    UUID hospedeId,
    String hospedeNome,
    String hospedeTelefone,
    LocalDate dataCheckin,
    LocalDate dataCheckout,
    OrigemReserva origem,
    BigDecimal valorTotal,
    BigDecimal taxaLimpezaHospede,
    Integer numPessoas,
    String observacoes,
    StatusReserva status,
    LocalDateTime criadoEm
) {
    public static ReservaResponse from(Reserva r) {
        return new ReservaResponse(
                r.getId(),
                r.getImovel().getId(),
                r.getImovel().getNome(),
                r.getHospede().getId(),
                r.getHospede().getNome(),
                r.getHospede().getTelefone(),
                r.getDataCheckin(),
                r.getDataCheckout(),
                r.getOrigem(),
                r.getValorTotal(),
                r.getTaxaLimpezaHospede(),
                r.getNumPessoas(),
                r.getObservacoes(),
                r.getStatus(),
                r.getCriadoEm()
        );
    }
}
