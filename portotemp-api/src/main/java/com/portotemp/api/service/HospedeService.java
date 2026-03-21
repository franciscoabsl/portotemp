package com.portotemp.api.service;

import com.portotemp.api.domain.hospede.Hospede;
import com.portotemp.api.dto.HospedeRequest;
import com.portotemp.api.dto.HospedeResponse;
import com.portotemp.api.repository.HospedeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HospedeService {

    private final HospedeRepository hospedeRepository;
    private final TenantService tenantService;

    public List<HospedeResponse> listar() {
        UUID tenantId = tenantService.getCurrentTenantId();
        return hospedeRepository.findAllByTenantId(tenantId)
                .stream()
                .map(HospedeResponse::from)
                .toList();
    }

    public HospedeResponse buscarPorId(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return hospedeRepository.findByIdAndTenantId(id, tenantId)
                .map(HospedeResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Hóspede não encontrado"));
    }

    @Transactional
    public HospedeResponse criar(HospedeRequest request) {
        Hospede hospede = Hospede.builder()
                .tenant(tenantService.getCurrentTenant())
                .nome(request.nome())
                .telefone(request.telefone())
                .email(request.email())
                .build();
        return HospedeResponse.from(hospedeRepository.save(hospede));
    }

    @Transactional
    public HospedeResponse atualizar(UUID id, HospedeRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();
        Hospede hospede = hospedeRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Hóspede não encontrado"));

        hospede.setNome(request.nome());
        hospede.setTelefone(request.telefone());
        hospede.setEmail(request.email());

        return HospedeResponse.from(hospedeRepository.save(hospede));
    }
}
