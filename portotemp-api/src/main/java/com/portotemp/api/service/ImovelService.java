package com.portotemp.api.service;

import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.domain.proprietario.Proprietario;
import com.portotemp.api.dto.ImovelRequest;
import com.portotemp.api.dto.ImovelResponse;
import com.portotemp.api.repository.ImovelRepository;
import com.portotemp.api.repository.ProprietarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImovelService {

    private final ImovelRepository imovelRepository;
    private final ProprietarioRepository proprietarioRepository;
    private final TenantService tenantService;

    public List<ImovelResponse> listar() {
        UUID tenantId = tenantService.getCurrentTenantId();
        return imovelRepository.findAllByTenantIdAndAtivoTrue(tenantId)
                .stream()
                .map(ImovelResponse::from)
                .toList();
    }

    public List<ImovelResponse> listarPorProprietario(UUID proprietarioId) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return imovelRepository.findAllByTenantIdAndProprietarioIdAndAtivoTrue(tenantId, proprietarioId)
                .stream()
                .map(ImovelResponse::from)
                .toList();
    }

    public ImovelResponse buscarPorId(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return imovelRepository.findByIdAndTenantId(id, tenantId)
                .map(ImovelResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));
    }

    @Transactional
    public ImovelResponse criar(ImovelRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Proprietario proprietario = proprietarioRepository
                .findByIdAndTenantId(request.proprietarioId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Proprietário não encontrado"));

        Imovel imovel = Imovel.builder()
                .tenant(tenantService.getCurrentTenant())
                .proprietario(proprietario)
                .nome(request.nome())
                .endereco(request.endereco())
                .codigoFechadura(request.codigoFechadura())
                .taxaLimpezaHospede(request.taxaLimpezaHospede())
                .baseCalculoComissao(request.baseCalculoComissao())
                .percentualComissao(request.percentualComissao())
                .respLimpeza(request.respLimpeza() != null ? request.respLimpeza() : false)
                .respLavanderia(request.respLavanderia() != null ? request.respLavanderia() : false)
                .respDespesas(request.respDespesas() != null ? request.respDespesas() : false)
                .build();

        return ImovelResponse.from(imovelRepository.save(imovel));
    }

    @Transactional
    public ImovelResponse atualizar(UUID id, ImovelRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Imovel imovel = imovelRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        Proprietario proprietario = proprietarioRepository
                .findByIdAndTenantId(request.proprietarioId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Proprietário não encontrado"));

        imovel.setProprietario(proprietario);
        imovel.setNome(request.nome());
        imovel.setEndereco(request.endereco());
        imovel.setCodigoFechadura(request.codigoFechadura());
        imovel.setTaxaLimpezaHospede(request.taxaLimpezaHospede());
        imovel.setBaseCalculoComissao(request.baseCalculoComissao());
        imovel.setPercentualComissao(request.percentualComissao());
        imovel.setRespLimpeza(request.respLimpeza() != null ? request.respLimpeza() : false);
        imovel.setRespLavanderia(request.respLavanderia() != null ? request.respLavanderia() : false);
        imovel.setRespDespesas(request.respDespesas() != null ? request.respDespesas() : false);

        return ImovelResponse.from(imovelRepository.save(imovel));
    }

    @Transactional
    public void inativar(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Imovel imovel = imovelRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        imovel.setAtivo(false);
        imovelRepository.save(imovel);
    }
}
