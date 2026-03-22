package com.portotemp.api.domain.template;

import com.portotemp.api.domain.imovel.Imovel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "template_mensagem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateMensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imovel_id", nullable = false)
    private Imovel imovel;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoTemplate tipo;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private IdiomaTemplate idioma;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.idioma == null) this.idioma = IdiomaTemplate.PT;
    }
}
