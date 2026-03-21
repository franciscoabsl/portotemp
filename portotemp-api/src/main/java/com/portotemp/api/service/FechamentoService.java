package com.portotemp.api.service;

import com.portotemp.api.domain.despesa.Despesa;
import com.portotemp.api.domain.fechamento.*;
import com.portotemp.api.domain.imovel.BaseCalculoComissao;
import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.domain.limpeza.Lavanderia;
import com.portotemp.api.domain.limpeza.Limpeza;
import com.portotemp.api.domain.proprietario.Proprietario;
import com.portotemp.api.domain.reserva.Reserva;
import com.portotemp.api.dto.FechamentoResponse;
import com.portotemp.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FechamentoService {

    private final FechamentoRepository fechamentoRepository;
    private final ProprietarioRepository proprietarioRepository;
    private final ReservaRepository reservaRepository;
    private final LimpezaRepository limpezaRepository;
    private final LavanderiaRepository lavanderiaRepository;
    private final DespesaRepository despesaRepository;
    private final TenantService tenantService;

    public List<FechamentoResponse> listar() {
        UUID tenantId = tenantService.getCurrentTenantId();
        return fechamentoRepository.findAllByTenantIdOrderByAnoDescMesDesc(tenantId)
                .stream()
                .map(FechamentoResponse::from)
                .toList();
    }

    public List<FechamentoResponse> listarPorProprietario(UUID proprietarioId) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return fechamentoRepository.findAllByTenantIdAndProprietarioIdOrderByAnoDescMesDesc(tenantId, proprietarioId)
                .stream()
                .map(FechamentoResponse::from)
                .toList();
    }

    public FechamentoResponse buscarPorId(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        return fechamentoRepository.findByIdAndTenantId(id, tenantId)
                .map(FechamentoResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Fechamento não encontrado"));
    }

    @Transactional
    public FechamentoResponse gerar(UUID proprietarioId, int mes, int ano) {
        UUID tenantId = tenantService.getCurrentTenantId();

        // Verifica se já existe fechamento para este período
        fechamentoRepository.findByTenantIdAndProprietarioIdAndMesAndAno(tenantId, proprietarioId, mes, ano)
                .ifPresent(f -> { throw new IllegalArgumentException("Já existe fechamento para este período"); });

        Proprietario proprietario = proprietarioRepository.findByIdAndTenantId(proprietarioId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Proprietário não encontrado"));

        // Busca reservas com checkout no mês
        List<Reserva> reservas = reservaRepository.findByFechamento(tenantId, proprietarioId, mes, ano);

        List<FechamentoItem> itens = new ArrayList<>();
        BigDecimal totalComissao = BigDecimal.ZERO;
        BigDecimal totalReembolsos = BigDecimal.ZERO;

        for (Reserva reserva : reservas) {
            Imovel imovel = reserva.getImovel();
            BigDecimal valorTotal = reserva.getValorTotal();

            // Busca limpeza e lavanderia da reserva
            BigDecimal custoLimpeza = limpezaRepository.findByReservaId(reserva.getId())
                    .map(Limpeza::getValorPago)
                    .orElse(BigDecimal.ZERO);

            BigDecimal custoLavanderia = lavanderiaRepository.findByReservaId(reserva.getId())
                    .map(Lavanderia::getValorPago)
                    .orElse(BigDecimal.ZERO);

            // Calcula base da comissão
            BigDecimal baseComissao = imovel.getBaseCalculoComissao() == BaseCalculoComissao.LIQUIDO
                    ? valorTotal.subtract(custoLimpeza).subtract(custoLavanderia)
                    : valorTotal;

            // Calcula comissão
            BigDecimal comissao = baseComissao
                    .multiply(imovel.getPercentualComissao())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            totalComissao = totalComissao.add(comissao);

            // Item de comissão
            itens.add(FechamentoItem.builder()
                    .tipo(TipoItemFechamento.COMISSAO)
                    .referenciaId(reserva.getId())
                    .descricao("Comissão - " + reserva.getHospede().getNome() +
                               " (" + reserva.getDataCheckin() + " a " + reserva.getDataCheckout() + ")")
                    .valor(comissao)
                    .build());

            // Item de limpeza (se responsabilidade do gestor)
            if (imovel.getRespLimpeza() && custoLimpeza.compareTo(BigDecimal.ZERO) > 0) {
                totalReembolsos = totalReembolsos.add(custoLimpeza);
                itens.add(FechamentoItem.builder()
                        .tipo(TipoItemFechamento.LIMPEZA)
                        .referenciaId(reserva.getId())
                        .descricao("Limpeza - " + reserva.getHospede().getNome())
                        .valor(custoLimpeza)
                        .build());
            }

            // Item de lavanderia (se responsabilidade do gestor)
            if (imovel.getRespLavanderia() && custoLavanderia.compareTo(BigDecimal.ZERO) > 0) {
                totalReembolsos = totalReembolsos.add(custoLavanderia);
                itens.add(FechamentoItem.builder()
                        .tipo(TipoItemFechamento.LAVANDERIA)
                        .referenciaId(reserva.getId())
                        .descricao("Lavanderia - " + reserva.getHospede().getNome())
                        .valor(custoLavanderia)
                        .build());
            }
        }

        // Busca despesas do período por imóvel do proprietário
        LocalDate inicioPeriodo = LocalDate.of(ano, mes, 1);
        LocalDate fimPeriodo = inicioPeriodo.withDayOfMonth(inicioPeriodo.lengthOfMonth());

        List<Imovel> imoveisProprietario = reservas.stream()
                .map(Reserva::getImovel)
                .distinct()
                .toList();

        for (Imovel imovel : imoveisProprietario) {
            List<Despesa> despesas = despesaRepository
                    .findAllByTenantIdAndImovelIdAndCompetenciaBetween(
                            tenantId, imovel.getId(), inicioPeriodo, fimPeriodo);

            for (Despesa despesa : despesas) {
                totalReembolsos = totalReembolsos.add(despesa.getValor());
                itens.add(FechamentoItem.builder()
                        .tipo(TipoItemFechamento.DESPESA)
                        .referenciaId(despesa.getId())
                        .descricao(despesa.getTipo() + (despesa.getDescricao() != null ?
                                " - " + despesa.getDescricao() : ""))
                        .valor(despesa.getValor())
                        .build());
            }
        }

        BigDecimal totalAReceber = totalComissao.add(totalReembolsos);

        Fechamento fechamento = Fechamento.builder()
                .tenant(tenantService.getCurrentTenant())
                .proprietario(proprietario)
                .mes(mes)
                .ano(ano)
                .totalComissao(totalComissao)
                .totalReembolsos(totalReembolsos)
                .totalAReceber(totalAReceber)
                .build();

        fechamento = fechamentoRepository.save(fechamento);

        // Vincula itens ao fechamento
        for (FechamentoItem item : itens) {
            item.setFechamento(fechamento);
        }
        fechamento.setItens(itens);
        fechamento = fechamentoRepository.save(fechamento);

        return FechamentoResponse.from(fechamento);
    }

    @Transactional
    public FechamentoResponse fechar(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        Fechamento fechamento = fechamentoRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Fechamento não encontrado"));
        fechamento.setStatus(StatusFechamento.FECHADO);
        return FechamentoResponse.from(fechamentoRepository.save(fechamento));
    }

    @Transactional
    public void excluir(UUID id) {
        UUID tenantId = tenantService.getCurrentTenantId();
        Fechamento fechamento = fechamentoRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Fechamento não encontrado"));
        if (fechamento.getStatus() == StatusFechamento.FECHADO) {
            throw new IllegalArgumentException("Não é possível excluir um fechamento já fechado");
        }
        fechamentoRepository.delete(fechamento);
    }
}
