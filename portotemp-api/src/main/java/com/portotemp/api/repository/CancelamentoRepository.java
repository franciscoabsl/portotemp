package com.portotemp.api.repository;

import com.portotemp.api.domain.cancelamento.Cancelamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CancelamentoRepository extends JpaRepository<Cancelamento, UUID> {
    Optional<Cancelamento> findByReservaId(UUID reservaId);
}
