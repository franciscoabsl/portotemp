package com.portotemp.api.domain.limpeza;

import com.portotemp.api.domain.prestador.Prestador;
import com.portotemp.api.domain.reserva.Reserva;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "limpeza")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Limpeza {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prestador_id")
    private Prestador prestador;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private BigDecimal valorPago;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusLimpeza status;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.status == null) this.status = StatusLimpeza.PENDENTE;
        if (this.valorPago == null) this.valorPago = BigDecimal.ZERO;
    }
}
