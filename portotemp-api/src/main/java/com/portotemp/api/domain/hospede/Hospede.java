package com.portotemp.api.domain.hospede;

import com.portotemp.api.domain.tenant.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "hospede")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospede {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false)
    private String nome;

    private String telefone;

    private String email;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }
}
