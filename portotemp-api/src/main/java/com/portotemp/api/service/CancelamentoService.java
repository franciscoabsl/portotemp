package com.portotemp.api.service;

import com.portotemp.api.domain.cancelamento.Cancelamento;
import com.portotemp.api.domain.reserva.Reserva;
import com.portotemp.api.domain.reserva.StatusReserva;
import com.portotemp.api.dto.CancelamentoRequest;
import com.portotemp.api.dto.CancelamentoResponse;
import com.portotemp.api.repository.CancelamentoRepository;
import com.portotemp.api.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CancelamentoService {

    private final CancelamentoRepository cancelamentoRepository;
    private final ReservaRepository reservaRepository;
    private final TenantService tenantService;

    public CancelamentoResponse buscarPorReserva(UUID reservaId) {
        return cancelamentoRepository.findByReservaId(reservaId)
                .map(CancelamentoResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Cancelamento não encontrado"));
    }

    @Transactional
    public CancelamentoResponse cancelar(UUID reservaId, CancelamentoRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Reserva reserva = reservaRepository.findByIdAndTenantId(reservaId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        if (reserva.getStatus() == StatusReserva.CANCELADA) {
            throw new IllegalArgumentException("Reserva já cancelada");
        }

        if (reserva.getStatus() == StatusReserva.CONCLUIDA) {
            throw new IllegalArgumentException("Não é possível cancelar uma reserva concluída");
        }

        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);

        Cancelamento cancelamento = Cancelamento.builder()
                .reserva(reserva)
                .dataCancelamento(request.dataCancelamento() != null ?
                        request.dataCancelamento() : LocalDate.now())
                .valorMulta(request.valorMulta() != null ?
                        request.valorMulta() : java.math.BigDecimal.ZERO)
                .motivo(request.motivo())
                .build();

        return CancelamentoResponse.from(cancelamentoRepository.save(cancelamento));
    }
}
