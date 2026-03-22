package com.portotemp.api.config;

import com.portotemp.api.domain.hospede.Hospede;
import com.portotemp.api.domain.imovel.BaseCalculoComissao;
import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.domain.proprietario.Proprietario;
import com.portotemp.api.domain.tenant.Tenant;
import com.portotemp.api.domain.usuario.RoleUsuario;
import com.portotemp.api.domain.usuario.Usuario;
import com.portotemp.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DevDataLoader implements CommandLineRunner {

    private final TenantRepository tenantRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProprietarioRepository proprietarioRepository;
    private final ImovelRepository imovelRepository;
    private final HospedeRepository hospedeRepository;
    private final PasswordEncoder passwordEncoder;

    private static final UUID TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Override
    public void run(String... args) {
        if (tenantRepository.existsById(TENANT_ID)) return;

        log.info("Carregando dados de desenvolvimento...");

        Tenant tenant = Tenant.builder()
                .id(TENANT_ID)
                .nome("Francisco Lima")
                .email("francisco@portotemp.com")
                .build();
        tenantRepository.save(tenant);

        usuarioRepository.save(Usuario.builder()
                .id(UUID.fromString("00000000-0000-0000-0000-000000000002"))
                .tenant(tenant)
                .nome("Francisco Lima")
                .email("francisco@portotemp.com")
                .senhaHash(passwordEncoder.encode("portotemp123"))
                .role(RoleUsuario.ADMIN)
                .build());

        Proprietario joao = proprietarioRepository.save(Proprietario.builder()
                .id(UUID.fromString("00000000-0000-0000-0000-000000000010"))
                .tenant(tenant).nome("João Silva")
                .email("joao@email.com").telefone("(81) 99999-1111").build());

        Proprietario maria = proprietarioRepository.save(Proprietario.builder()
                .id(UUID.fromString("00000000-0000-0000-0000-000000000011"))
                .tenant(tenant).nome("Maria Santos")
                .email("maria@email.com").telefone("(81) 99999-2222").build());

        imovelRepository.save(Imovel.builder()
                .id(UUID.fromString("00000000-0000-0000-0000-000000000020"))
                .tenant(tenant).proprietario(joao)
                .nome("Apto Boa Viagem 101")
                .endereco("Av. Boa Viagem, 101 - Recife/PE")
                .codigoFechadura("1234")
                .taxaLimpezaHospede(new BigDecimal("150.00"))
                .baseCalculoComissao(BaseCalculoComissao.LIQUIDO)
                .percentualComissao(new BigDecimal("15.00"))
                .respLimpeza(true).respLavanderia(true).respDespesas(false).build());

        imovelRepository.save(Imovel.builder()
                .id(UUID.fromString("00000000-0000-0000-0000-000000000021"))
                .tenant(tenant).proprietario(maria)
                .nome("Apto Porto de Galinhas 202")
                .endereco("Rua da Praia, 202 - Porto de Galinhas/PE")
                .codigoFechadura("5678")
                .taxaLimpezaHospede(new BigDecimal("150.00"))
                .baseCalculoComissao(BaseCalculoComissao.LIQUIDO)
                .percentualComissao(new BigDecimal("10.00"))
                .respLimpeza(true).respLavanderia(true).respDespesas(false).build());

        hospedeRepository.save(Hospede.builder()
                .id(UUID.fromString("00000000-0000-0000-0000-000000000030"))
                .tenant(tenant).nome("Carlos Pereira")
                .telefone("(81) 98888-1234").email("carlos@email.com").build());

        hospedeRepository.save(Hospede.builder()
                .id(UUID.fromString("00000000-0000-0000-0000-000000000031"))
                .tenant(tenant).nome("Ana Paula")
                .telefone("(81) 97777-5678").email("ana.paula@email.com").build());

        log.info("Dados de desenvolvimento carregados com sucesso!");
    }
}
