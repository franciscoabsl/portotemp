package com.portotemp.api.repository;

import com.portotemp.api.domain.limpeza.Limpeza;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LimpezaRepository extends JpaRepository<Limpeza, UUID> {

    Optional<Limpeza> findByReservaId(UUID reservaId);

    List<Limpeza> findAllByReserva_Imovel_TenantIdAndDataBetweenOrderByData(
            UUID tenantId, LocalDate inicio, LocalDate fim);

    List<Limpeza> findAllByReserva_Imovel_IdAndReserva_Imovel_TenantId(UUID imovelId, UUID tenantId);
}
