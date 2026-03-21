package com.portotemp.api.service;

import com.portotemp.api.domain.hospede.Hospede;
import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.domain.reserva.Reserva;
import com.portotemp.api.domain.reserva.StatusReserva;
import com.portotemp.api.dto.ReservaRequest;
import com.portotemp.api.dto.ReservaResponse;
import com.portotemp.api.repository.HospedeRepository;
import com.portotemp.api.repository.ImovelRepository;
import com.portotemp.api.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final ImovelRepository imovelRepository;
    private final HospedeRepository hospedeRepository;
    private final TenantService tenantService;

    public List<ReservaResponse> listar() {
        UUID tenantId = tenantService.getCurrentTenantId();
        return reservaRepository.findAllByTenantIdOrderByDataCheckinDesc(tenantId)
                .stream()
                .map(ReservaResponse::from)
                .toList();
    }

    public List<ReservaResponse> listarPorImovel(UUID imovelId) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return reservaRepository.findAllByTenantIdAndImovelIdOrderByDataCheckinDesc(tenantId, imovelId)
                .stream()
                .map(ReservaResponse::from)
                .toList();
    }

    public ReservaResponse buscarPorId(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return reservaRepository.findByIdAndTenantId(id, tenantId)
                .map(ReservaResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));
    }

    @Transactional
    public ReservaResponse criar(ReservaRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        if (request.dataCheckout().isBefore(request.dataCheckin()) ||
            request.dataCheckout().isEqual(request.dataCheckin())) {
            throw new IllegalArgumentException("Data de check-out deve ser posterior ao check-in");
        }

        Imovel imovel = imovelRepository.findByIdAndTenantId(request.imovelId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        Hospede hospede = hospedeRepository.findByIdAndTenantId(request.hospedeId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Hóspede não encontrado"));

        List<Reserva> conflitos = reservaRepository.findConflitos(
                tenantId, request.imovelId(), request.dataCheckin(), request.dataCheckout());
        if (!conflitos.isEmpty()) {
            throw new IllegalArgumentException("Já existe uma reserva para este imóvel no período informado");
        }

        Reserva reserva = Reserva.builder()
                .tenant(tenantService.getCurrentTenant())
                .imovel(imovel)
                .hospede(hospede)
                .dataCheckin(request.dataCheckin())
                .dataCheckout(request.dataCheckout())
                .origem(request.origem())
                .valorTotal(request.valorTotal())
                .taxaLimpezaHospede(request.taxaLimpezaHospede() != null ? request.taxaLimpezaHospede() : imovel.getTaxaLimpezaHospede())
                .numPessoas(request.numPessoas())
                .observacoes(request.observacoes())
                .build();

        return ReservaResponse.from(reservaRepository.save(reserva));
    }

    @Transactional
    public ReservaResponse atualizar(UUID id, ReservaRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Reserva reserva = reservaRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        if (reserva.getStatus() == StatusReserva.CANCELADA) {
            throw new IllegalArgumentException("Não é possível editar uma reserva cancelada");
        }

        Hospede hospede = hospedeRepository.findByIdAndTenantId(request.hospedeId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Hóspede não encontrado"));

        reserva.setHospede(hospede);
        reserva.setDataCheckin(request.dataCheckin());
        reserva.setDataCheckout(request.dataCheckout());
        reserva.setOrigem(request.origem());
        reserva.setValorTotal(request.valorTotal());
        reserva.setTaxaLimpezaHospede(request.taxaLimpezaHospede());
        reserva.setNumPessoas(request.numPessoas());
        reserva.setObservacoes(request.observacoes());

        return ReservaResponse.from(reservaRepository.save(reserva));
    }

    @Transactional
    public ReservaResponse atualizarStatus(UUID id, StatusReserva status) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Reserva reserva = reservaRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        reserva.setStatus(status);
        return ReservaResponse.from(reservaRepository.save(reserva));
    }
}
