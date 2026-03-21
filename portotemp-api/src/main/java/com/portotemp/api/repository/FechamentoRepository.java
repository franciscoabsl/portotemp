package com.portotemp.api.repository;

import com.portotemp.api.domain.fechamento.Fechamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FechamentoRepository extends JpaRepository<Fechamento, UUID> {

    List<Fechamento> findAllByTenantIdOrderByAnoDescMesDesc(UUID tenantId);

    List<Fechamento> findAllByTenantIdAndProprietarioIdOrderByAnoDescMesDesc(UUID tenantId, UUID proprietarioId);

    Optional<Fechamento> findByIdAndTenantId(UUID id, UUID tenantId);

    Optional<Fechamento> findByTenantIdAndProprietarioIdAndMesAndAno(
            UUID tenantId, UUID proprietarioId, int mes, int ano);
}
