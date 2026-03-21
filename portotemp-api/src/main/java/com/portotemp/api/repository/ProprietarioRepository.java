package com.portotemp.api.repository;

import com.portotemp.api.domain.proprietario.Proprietario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProprietarioRepository extends JpaRepository<Proprietario, UUID> {

    List<Proprietario> findAllByTenantIdAndAtivoTrue(UUID tenantId);

    Optional<Proprietario> findByIdAndTenantId(UUID id, UUID tenantId);

    boolean existsByEmailAndTenantId(String email, UUID tenantId);
}
