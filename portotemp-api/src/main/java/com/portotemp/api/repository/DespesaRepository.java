package com.portotemp.api.repository;

import com.portotemp.api.domain.despesa.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DespesaRepository extends JpaRepository<Despesa, UUID> {

    List<Despesa> findAllByTenantIdAndImovelIdOrderByCompetenciaDesc(UUID tenantId, UUID imovelId);

    List<Despesa> findAllByTenantIdOrderByCompetenciaDesc(UUID tenantId);

    Optional<Despesa> findByIdAndTenantId(UUID id, UUID tenantId);

    List<Despesa> findAllByTenantIdAndImovelIdAndCompetenciaBetween(
            UUID tenantId, UUID imovelId, LocalDate inicio, LocalDate fim);
}
