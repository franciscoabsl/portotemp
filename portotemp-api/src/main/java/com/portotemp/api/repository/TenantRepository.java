package com.portotemp.api.repository;

import com.portotemp.api.domain.tenant.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    Optional<Tenant> findByEmail(String email);
    boolean existsByEmail(String email);
}
