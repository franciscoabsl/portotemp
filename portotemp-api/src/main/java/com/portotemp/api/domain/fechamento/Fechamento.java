package com.portotemp.api.domain.fechamento;

import com.portotemp.api.domain.proprietario.Proprietario;
import com.portotemp.api.domain.tenant.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "fechamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fechamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietario_id", nullable = false)
    private Proprietario proprietario;

    @Column(nullable = false)
    private Integer mes;

    @Column(nullable = false)
    private Integer ano;

    @Column(name = "total_comissao", nullable = false)
    private BigDecimal totalComissao;

    @Column(name = "total_reembolsos", nullable = false)
    private BigDecimal totalReembolsos;

    @Column(name = "total_a_receber", nullable = false)
    private BigDecimal totalAReceber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusFechamento status;

    @Column(name = "gerado_em", nullable = false)
    private LocalDateTime geradoEm;

    @OneToMany(mappedBy = "fechamento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<FechamentoItem> itens = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.geradoEm = LocalDateTime.now();
        if (this.status == null) this.status = StatusFechamento.ABERTO;
        if (this.totalComissao == null) this.totalComissao = BigDecimal.ZERO;
        if (this.totalReembolsos == null) this.totalReembolsos = BigDecimal.ZERO;
        if (this.totalAReceber == null) this.totalAReceber = BigDecimal.ZERO;
    }
}
