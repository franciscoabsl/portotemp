package com.portotemp.api.service;

import com.portotemp.api.domain.tenant.Tenant;
import com.portotemp.api.domain.usuario.RoleUsuario;
import com.portotemp.api.domain.usuario.Usuario;
import com.portotemp.api.dto.AuthResponse;
import com.portotemp.api.dto.LoginRequest;
import com.portotemp.api.dto.RegisterRequest;
import com.portotemp.api.repository.TenantRepository;
import com.portotemp.api.repository.UsuarioRepository;
import com.portotemp.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TenantRepository tenantRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (tenantRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Tenant tenant = Tenant.builder()
                .nome(request.nome())
                .email(request.email())
                .build();
        tenantRepository.save(tenant);

        Usuario usuario = Usuario.builder()
                .tenant(tenant)
                .nome(request.nome())
                .email(request.email())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .role(RoleUsuario.ADMIN)
                .build();
        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario, tenant.getId());

        return new AuthResponse(
                token,
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole().name(),
                tenant.getId()
        );
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        String token = jwtService.generateToken(usuario, usuario.getTenant().getId());

        return new AuthResponse(
                token,
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole().name(),
                usuario.getTenant().getId()
        );
    }
}
