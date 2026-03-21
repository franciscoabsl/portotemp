package com.portotemp.api.repository;

import com.portotemp.api.domain.imovel.Imovel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ImovelRepository extends JpaRepository<Imovel, UUID> {

    List<Imovel> findAllByTenantIdAndAtivoTrue(UUID tenantId);

    List<Imovel> findAllByTenantIdAndProprietarioIdAndAtivoTrue(UUID tenantId, UUID proprietarioId);

    Optional<Imovel> findByIdAndTenantId(UUID id, UUID tenantId);
}
