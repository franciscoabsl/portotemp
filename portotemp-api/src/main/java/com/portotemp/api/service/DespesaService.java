package com.portotemp.api.service;

import com.portotemp.api.domain.despesa.Despesa;
import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.dto.DespesaRequest;
import com.portotemp.api.dto.DespesaResponse;
import com.portotemp.api.repository.DespesaRepository;
import com.portotemp.api.repository.ImovelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DespesaService {

    private final DespesaRepository despesaRepository;
    private final ImovelRepository imovelRepository;
    private final TenantService tenantService;

    public List<DespesaResponse> listar() {
        UUID tenantId = tenantService.getCurrentTenantId();
        return despesaRepository.findAllByTenantIdOrderByCompetenciaDesc(tenantId)
                .stream()
                .map(DespesaResponse::from)
                .toList();
    }

    public List<DespesaResponse> listarPorImovel(UUID imovelId) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return despesaRepository.findAllByTenantIdAndImovelIdOrderByCompetenciaDesc(tenantId, imovelId)
                .stream()
                .map(DespesaResponse::from)
                .toList();
    }

    public DespesaResponse buscarPorId(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return despesaRepository.findByIdAndTenantId(id, tenantId)
                .map(DespesaResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Despesa não encontrada"));
    }

    @Transactional
    public DespesaResponse criar(DespesaRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Imovel imovel = imovelRepository.findByIdAndTenantId(request.imovelId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        Despesa despesa = Despesa.builder()
                .tenant(tenantService.getCurrentTenant())
                .imovel(imovel)
                .tipo(request.tipo())
                .descricao(request.descricao())
                .valor(request.valor())
                .competencia(request.competencia())
                .statusPagamento(request.statusPagamento())
                .build();

        return DespesaResponse.from(despesaRepository.save(despesa));
    }

    @Transactional
    public DespesaResponse atualizar(UUID id, DespesaRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Despesa despesa = despesaRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Despesa não encontrada"));

        Imovel imovel = imovelRepository.findByIdAndTenantId(request.imovelId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        despesa.setImovel(imovel);
        despesa.setTipo(request.tipo());
        despesa.setDescricao(request.descricao());
        despesa.setValor(request.valor());
        despesa.setCompetencia(request.competencia());
        if (request.statusPagamento() != null) despesa.setStatusPagamento(request.statusPagamento());

        return DespesaResponse.from(despesaRepository.save(despesa));
    }

    @Transactional
    public void excluir(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        Despesa despesa = despesaRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Despesa não encontrada"));
        despesaRepository.delete(despesa);
    }
}
