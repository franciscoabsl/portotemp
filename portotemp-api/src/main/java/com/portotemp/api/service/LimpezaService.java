package com.portotemp.api.service;

import com.portotemp.api.domain.limpeza.Limpeza;
import com.portotemp.api.domain.limpeza.Lavanderia;
import com.portotemp.api.domain.limpeza.StatusLimpeza;
import com.portotemp.api.domain.prestador.Prestador;
import com.portotemp.api.domain.reserva.Reserva;
import com.portotemp.api.dto.LavanderiaResponse;
import com.portotemp.api.dto.LimpezaRequest;
import com.portotemp.api.dto.LimpezaResponse;
import com.portotemp.api.repository.LavanderiaRepository;
import com.portotemp.api.repository.LimpezaRepository;
import com.portotemp.api.repository.PrestadorRepository;
import com.portotemp.api.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LimpezaService {

    private final LimpezaRepository limpezaRepository;
    private final LavanderiaRepository lavanderiaRepository;
    private final ReservaRepository reservaRepository;
    private final PrestadorRepository prestadorRepository;
    private final TenantService tenantService;

    @Transactional
    public Limpeza criarAutomatica(Reserva reserva) {
        Limpeza limpeza = Limpeza.builder()
                .reserva(reserva)
                .data(reserva.getDataCheckout())
                .build();
        return limpezaRepository.save(limpeza);
    }

    @Transactional(readOnly = true)
    public LimpezaResponse buscarPorReserva(UUID reservaId) {
        return limpezaRepository.findByReservaId(reservaId)
                .map(LimpezaResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Limpeza não encontrada"));
    }

    @Transactional
    public LimpezaResponse atualizarLimpeza(UUID reservaId, LimpezaRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Limpeza limpeza = limpezaRepository.findByReservaId(reservaId)
                .orElseThrow(() -> new IllegalArgumentException("Limpeza não encontrada"));

        if (request.prestadorId() != null) {
            Prestador prestador = prestadorRepository.findByIdAndTenantId(request.prestadorId(), tenantId)
                    .orElseThrow(() -> new IllegalArgumentException("Prestador não encontrado"));
            limpeza.setPrestador(prestador);
        }

        limpeza.setData(request.data());
        if (request.valorPago() != null) limpeza.setValorPago(request.valorPago());

        return LimpezaResponse.from(limpezaRepository.save(limpeza));
    }

    @Transactional
    public LimpezaResponse concluirLimpeza(UUID reservaId) {
        Limpeza limpeza = limpezaRepository.findByReservaId(reservaId)
                .orElseThrow(() -> new IllegalArgumentException("Limpeza não encontrada"));
        limpeza.setStatus(StatusLimpeza.CONCLUIDA);
        return LimpezaResponse.from(limpezaRepository.save(limpeza));
    }

    @Transactional
    public LavanderiaResponse registrarLavanderia(UUID reservaId, LimpezaRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Reserva reserva = reservaRepository.findByIdAndTenantId(reservaId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        Prestador prestador = null;
        if (request.prestadorId() != null) {
            prestador = prestadorRepository.findByIdAndTenantId(request.prestadorId(), tenantId)
                    .orElseThrow(() -> new IllegalArgumentException("Prestador não encontrado"));
        }

        Lavanderia lavanderia = Lavanderia.builder()
                .reserva(reserva)
                .data(request.data())
                .valorPago(request.valorPago())
                .prestador(prestador)
                .build();

        return LavanderiaResponse.from(lavanderiaRepository.save(lavanderia));
    }

    @Transactional(readOnly = true)
    public LavanderiaResponse buscarLavanderiaPorReserva(UUID reservaId) {
        return lavanderiaRepository.findByReservaId(reservaId)
                .map(LavanderiaResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Lavanderia não encontrada"));
    }
}
