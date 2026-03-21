package com.portotemp.api.domain.imovel;

import com.portotemp.api.domain.proprietario.Proprietario;
import com.portotemp.api.domain.tenant.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "imovel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Imovel {

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
    private String nome;

    private String endereco;

    private String codigoFechadura;

    @Column(nullable = false)
    private BigDecimal taxaLimpezaHospede;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BaseCalculoComissao baseCalculoComissao;

    @Column(nullable = false)
    private BigDecimal percentualComissao;

    @Column(nullable = false)
    private Boolean respLimpeza;

    @Column(nullable = false)
    private Boolean respLavanderia;

    @Column(nullable = false)
    private Boolean respDespesas;

    @Column(nullable = false)
    private Boolean ativo;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.ativo == null) this.ativo = true;
        if (this.baseCalculoComissao == null) this.baseCalculoComissao = BaseCalculoComissao.BRUTO;
        if (this.taxaLimpezaHospede == null) this.taxaLimpezaHospede = BigDecimal.ZERO;
        if (this.percentualComissao == null) this.percentualComissao = BigDecimal.ZERO;
        if (this.respLimpeza == null) this.respLimpeza = false;
        if (this.respLavanderia == null) this.respLavanderia = false;
        if (this.respDespesas == null) this.respDespesas = false;
    }
}
