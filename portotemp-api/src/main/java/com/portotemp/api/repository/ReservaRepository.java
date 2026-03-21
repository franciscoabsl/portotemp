package com.portotemp.api.repository;

import com.portotemp.api.domain.reserva.Reserva;
import com.portotemp.api.domain.reserva.StatusReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservaRepository extends JpaRepository<Reserva, UUID> {

    List<Reserva> findAllByTenantIdOrderByDataCheckinDesc(UUID tenantId);

    List<Reserva> findAllByTenantIdAndImovelIdOrderByDataCheckinDesc(UUID tenantId, UUID imovelId);

    Optional<Reserva> findByIdAndTenantId(UUID id, UUID tenantId);

    @Query("SELECT r FROM Reserva r WHERE r.tenant.id = :tenantId " +
           "AND r.imovel.id = :imovelId " +
           "AND r.status != 'CANCELADA' " +
           "AND r.dataCheckin < :checkout " +
           "AND r.dataCheckout > :checkin")
    List<Reserva> findConflitos(@Param("tenantId") UUID tenantId,
                                @Param("imovelId") UUID imovelId,
                                @Param("checkin") LocalDate checkin,
                                @Param("checkout") LocalDate checkout);

    @Query("SELECT r FROM Reserva r WHERE r.tenant.id = :tenantId " +
           "AND FUNCTION('MONTH', r.dataCheckout) = :mes " +
           "AND FUNCTION('YEAR', r.dataCheckout) = :ano " +
           "AND r.imovel.proprietario.id = :proprietarioId " +
           "AND r.status != 'CANCELADA'")
    List<Reserva> findByFechamento(@Param("tenantId") UUID tenantId,
                                   @Param("proprietarioId") UUID proprietarioId,
                                   @Param("mes") int mes,
                                   @Param("ano") int ano);
}
