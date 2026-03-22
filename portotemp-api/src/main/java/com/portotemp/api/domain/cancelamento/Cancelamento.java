package com.portotemp.api.domain.cancelamento;

import com.portotemp.api.domain.reserva.Reserva;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cancelamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cancelamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @Column(nullable = false)
    private LocalDate dataCancelamento;

    @Column(nullable = false)
    private BigDecimal valorMulta;

    private String motivo;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.dataCancelamento == null) this.dataCancelamento = LocalDate.now();
        if (this.valorMulta == null) this.valorMulta = BigDecimal.ZERO;
    }
}
