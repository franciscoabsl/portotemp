package com.portotemp.api.config;

import com.portotemp.api.domain.hospede.Hospede;
import com.portotemp.api.domain.imovel.BaseCalculoComissao;
import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.domain.proprietario.Proprietario;
import com.portotemp.api.domain.reserva.OrigemReserva;
import com.portotemp.api.domain.reserva.Reserva;
import com.portotemp.api.domain.reserva.StatusReserva;
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
import java.time.LocalDate;
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
    private final ReservaRepository reservaRepository;
    private final PasswordEncoder passwordEncoder;

    private static final UUID TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Override
    public void run(String... args) {
        if (tenantRepository.existsById(TENANT_ID)) {
            log.info("[DEV] Dados já existem, pulando seed.");
            return;
        }

        log.info("[DEV] Carregando dados de desenvolvimento...");

        // Tenant + Admin
        Tenant tenant = tenantRepository.save(Tenant.builder()
                .id(TENANT_ID)
                .nome("Francisco Lima")
                .email("francisco@portotemp.com")
                .build());

        usuarioRepository.save(Usuario.builder()
                .id(UUID.fromString("00000000-0000-0000-0000-000000000002"))
                .tenant(tenant)
                .nome("Francisco Lima")
                .email("francisco@portotemp.com")
                .senhaHash(passwordEncoder.encode("portotemp123"))
                .role(RoleUsuario.ADMIN)
                .build());

        // Proprietários
        Proprietario joao = proprietarioRepository.save(Proprietario.builder()
                .tenant(tenant).nome("João Silva")
                .email("joao@email.com").telefone("(81) 99999-1111").build());

        Proprietario maria = proprietarioRepository.save(Proprietario.builder()
                .tenant(tenant).nome("Maria Santos")
                .email("maria@email.com").telefone("(81) 99999-2222").build());

        // Imóveis
        Imovel imovel1 = imovelRepository.save(Imovel.builder()
                .tenant(tenant).proprietario(joao)
                .nome("Apto Boa Viagem 101")
                .endereco("Av. Boa Viagem, 101 - Recife/PE")
                .codigoFechadura("1234")
                .taxaLimpezaHospede(new BigDecimal("150.00"))
                .baseCalculoComissao(BaseCalculoComissao.LIQUIDO)
                .percentualComissao(new BigDecimal("15.00"))
                .respLimpeza(true).respLavanderia(true).respDespesas(false).build());

        Imovel imovel2 = imovelRepository.save(Imovel.builder()
                .tenant(tenant).proprietario(maria)
                .nome("Apto Porto de Galinhas 202")
                .endereco("Rua da Praia, 202 - Porto de Galinhas/PE")
                .codigoFechadura("5678")
                .taxaLimpezaHospede(new BigDecimal("150.00"))
                .baseCalculoComissao(BaseCalculoComissao.LIQUIDO)
                .percentualComissao(new BigDecimal("10.00"))
                .respLimpeza(true).respLavanderia(true).respDespesas(false).build());

        // Hóspedes
        Hospede carlos = hospedeRepository.save(Hospede.builder()
                .tenant(tenant).nome("Carlos Pereira")
                .telefone("(81) 98888-1234").email("carlos@email.com").build());

        Hospede ana = hospedeRepository.save(Hospede.builder()
                .tenant(tenant).nome("Ana Paula")
                .telefone("(81) 97777-5678").email("ana.paula@email.com").build());

        Hospede marcos = hospedeRepository.save(Hospede.builder()
                .tenant(tenant).nome("Marcos Oliveira")
                .telefone("(81) 96666-9999").email("marcos@email.com").build());

        // Reservas
        reservaRepository.save(Reserva.builder()
                .tenant(tenant).imovel(imovel1).hospede(carlos)
                .dataCheckin(LocalDate.now().plusDays(2))
                .dataCheckout(LocalDate.now().plusDays(7))
                .origem(OrigemReserva.AIRBNB)
                .valorTotal(new BigDecimal("1500.00"))
                .taxaLimpezaHospede(new BigDecimal("150.00"))
                .numPessoas(3).build());

        reservaRepository.save(Reserva.builder()
                .tenant(tenant).imovel(imovel1).hospede(ana)
                .dataCheckin(LocalDate.now().plusDays(10))
                .dataCheckout(LocalDate.now().plusDays(15))
                .origem(OrigemReserva.BOOKING)
                .valorTotal(new BigDecimal("1200.00"))
                .taxaLimpezaHospede(new BigDecimal("150.00"))
                .numPessoas(2).build());

        reservaRepository.save(Reserva.builder()
                .tenant(tenant).imovel(imovel2).hospede(marcos)
                .dataCheckin(LocalDate.now().minusDays(2))
                .dataCheckout(LocalDate.now().plusDays(3))
                .origem(OrigemReserva.DIRETO)
                .valorTotal(new BigDecimal("900.00"))
                .taxaLimpezaHospede(new BigDecimal("100.00"))
                .numPessoas(4)
                .status(StatusReserva.EM_ANDAMENTO).build());

        log.info("[DEV] Seed concluido: 1 tenant, 1 admin, 2 proprietarios, 2 imoveis, 3 hospedes, 3 reservas.");
    }
}
