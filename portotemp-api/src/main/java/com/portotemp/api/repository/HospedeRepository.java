package com.portotemp.api.repository;

import com.portotemp.api.domain.hospede.Hospede;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HospedeRepository extends JpaRepository<Hospede, UUID> {

    List<Hospede> findAllByTenantId(UUID tenantId);

    Optional<Hospede> findByIdAndTenantId(UUID id, UUID tenantId);

    Optional<Hospede> findByTelefoneAndTenantId(String telefone, UUID tenantId);
}
