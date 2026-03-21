package com.portotemp.api.domain.reserva;

import com.portotemp.api.domain.hospede.Hospede;
import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.domain.tenant.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reserva")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imovel_id", nullable = false)
    private Imovel imovel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospede_id", nullable = false)
    private Hospede hospede;

    @Column(nullable = false)
    private LocalDate dataCheckin;

    @Column(nullable = false)
    private LocalDate dataCheckout;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrigemReserva origem;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @Column(nullable = false)
    private BigDecimal taxaLimpezaHospede;

    @Column(nullable = false)
    private Integer numPessoas;

    private String observacoes;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.status == null) this.status = StatusReserva.CONFIRMADA;
        if (this.origem == null) this.origem = OrigemReserva.DIRETO;
        if (this.valorTotal == null) this.valorTotal = BigDecimal.ZERO;
        if (this.taxaLimpezaHospede == null) this.taxaLimpezaHospede = BigDecimal.ZERO;
        if (this.numPessoas == null) this.numPessoas = 1;
    }
}
