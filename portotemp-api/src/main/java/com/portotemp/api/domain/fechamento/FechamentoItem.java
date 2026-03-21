package com.portotemp.api.domain.fechamento;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "fechamento_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FechamentoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fechamento_id", nullable = false)
    private Fechamento fechamento;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoItemFechamento tipo;

    private UUID referenciaId;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private BigDecimal valor;
}
