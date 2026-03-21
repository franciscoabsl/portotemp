package com.portotemp.api.repository;

import com.portotemp.api.domain.limpeza.Lavanderia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LavanderiaRepository extends JpaRepository<Lavanderia, UUID> {

    Optional<Lavanderia> findByReservaId(UUID reservaId);

    List<Lavanderia> findAllByReserva_Imovel_TenantIdAndReserva_Imovel_Id(UUID tenantId, UUID imovelId);
}
