package com.portotemp.api.service;

import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.domain.prestador.Prestador;
import com.portotemp.api.dto.PrestadorRequest;
import com.portotemp.api.dto.PrestadorResponse;
import com.portotemp.api.repository.ImovelRepository;
import com.portotemp.api.repository.PrestadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrestadorService {

    private final PrestadorRepository prestadorRepository;
    private final ImovelRepository imovelRepository;
    private final TenantService tenantService;

    public List<PrestadorResponse> listar() {
        UUID tenantId = tenantService.getCurrentTenantId();
        return prestadorRepository.findAllByTenantIdAndAtivoTrue(tenantId)
                .stream()
                .map(PrestadorResponse::from)
                .toList();
    }

    public List<PrestadorResponse> listarPorImovel(UUID imovelId) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return prestadorRepository.findAllByTenantIdAndImovelIdAndAtivoTrue(tenantId, imovelId)
                .stream()
                .map(PrestadorResponse::from)
                .toList();
    }

    @Transactional
    public PrestadorResponse criar(PrestadorRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Imovel imovel = imovelRepository.findByIdAndTenantId(request.imovelId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        Prestador prestador = Prestador.builder()
                .tenant(tenantService.getCurrentTenant())
                .imovel(imovel)
                .nome(request.nome())
                .telefone(request.telefone())
                .tipo(request.tipo())
                .build();

        return PrestadorResponse.from(prestadorRepository.save(prestador));
    }

    @Transactional
    public PrestadorResponse atualizar(UUID id, PrestadorRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Prestador prestador = prestadorRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Prestador não encontrado"));

        Imovel imovel = imovelRepository.findByIdAndTenantId(request.imovelId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        prestador.setNome(request.nome());
        prestador.setTelefone(request.telefone());
        prestador.setTipo(request.tipo());
        prestador.setImovel(imovel);

        return PrestadorResponse.from(prestadorRepository.save(prestador));
    }

    @Transactional
    public void inativar(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        Prestador prestador = prestadorRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Prestador não encontrado"));
        prestador.setAtivo(false);
        prestadorRepository.save(prestador);
    }
}
