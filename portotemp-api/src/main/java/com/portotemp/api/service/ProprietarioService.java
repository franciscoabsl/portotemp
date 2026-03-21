package com.portotemp.api.service;

import com.portotemp.api.domain.proprietario.Proprietario;
import com.portotemp.api.dto.ProprietarioRequest;
import com.portotemp.api.dto.ProprietarioResponse;
import com.portotemp.api.repository.ProprietarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProprietarioService {

    private final ProprietarioRepository proprietarioRepository;
    private final TenantService tenantService;

    public List<ProprietarioResponse> listar() {
        UUID tenantId = tenantService.getCurrentTenantId();
        return proprietarioRepository.findAllByTenantIdAndAtivoTrue(tenantId)
                .stream()
                .map(ProprietarioResponse::from)
                .toList();
    }

    public ProprietarioResponse buscarPorId(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return proprietarioRepository.findByIdAndTenantId(id, tenantId)
                .map(ProprietarioResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Proprietário não encontrado"));
    }

    @Transactional
    public ProprietarioResponse criar(ProprietarioRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        if (request.email() != null && proprietarioRepository.existsByEmailAndTenantId(request.email(), tenantId)) {
            throw new IllegalArgumentException("Email já cadastrado para este tenant");
        }

        Proprietario proprietario = Proprietario.builder()
                .tenant(tenantService.getCurrentTenant())
                .nome(request.nome())
                .email(request.email())
                .telefone(request.telefone())
                .cpfCnpj(request.cpfCnpj())
                .build();

        return ProprietarioResponse.from(proprietarioRepository.save(proprietario));
    }

    @Transactional
    public ProprietarioResponse atualizar(UUID id, ProprietarioRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Proprietario proprietario = proprietarioRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Proprietário não encontrado"));

        proprietario.setNome(request.nome());
        proprietario.setEmail(request.email());
        proprietario.setTelefone(request.telefone());
        proprietario.setCpfCnpj(request.cpfCnpj());

        return ProprietarioResponse.from(proprietarioRepository.save(proprietario));
    }

    @Transactional
    public void inativar(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Proprietario proprietario = proprietarioRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Proprietário não encontrado"));

        proprietario.setAtivo(false);
        proprietarioRepository.save(proprietario);
    }
}
