package com.portotemp.api.repository;

import com.portotemp.api.domain.prestador.Prestador;
import com.portotemp.api.domain.prestador.TipoPrestador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PrestadorRepository extends JpaRepository<Prestador, UUID> {

    List<Prestador> findAllByTenantIdAndAtivoTrue(UUID tenantId);

    List<Prestador> findAllByTenantIdAndImovelIdAndAtivoTrue(UUID tenantId, UUID imovelId);

    List<Prestador> findAllByTenantIdAndImovelIdAndTipoAndAtivoTrue(UUID tenantId, UUID imovelId, TipoPrestador tipo);

    Optional<Prestador> findByIdAndTenantId(UUID id, UUID tenantId);
}
