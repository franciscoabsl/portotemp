package com.portotemp.api.service;

import com.portotemp.api.domain.tenant.Tenant;
import com.portotemp.api.repository.TenantRepository;
import com.portotemp.api.security.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    public UUID getCurrentTenantId() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Nenhum tenant no contexto da requisição");
        }
        return tenantId;
    }

    public Tenant getCurrentTenant() {
        return tenantRepository.findById(getCurrentTenantId())
                .orElseThrow(() -> new IllegalStateException("Tenant não encontrado"));
    }
}
