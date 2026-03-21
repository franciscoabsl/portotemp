package com.portotemp.api.repository;

import com.portotemp.api.domain.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmailAndTenantId(String email, UUID tenantId);
}
