package com.portotemp.api.service;

import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.domain.reserva.Reserva;
import com.portotemp.api.domain.template.IdiomaTemplate;
import com.portotemp.api.domain.template.TemplateMensagem;
import com.portotemp.api.domain.template.TipoTemplate;
import com.portotemp.api.dto.TemplateRequest;
import com.portotemp.api.dto.TemplateResponse;
import com.portotemp.api.dto.WhatsAppLinkResponse;
import com.portotemp.api.repository.ImovelRepository;
import com.portotemp.api.repository.ReservaRepository;
import com.portotemp.api.repository.TemplateMensagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TemplateMensagemService {

    private final TemplateMensagemRepository templateRepository;
    private final ImovelRepository imovelRepository;
    private final ReservaRepository reservaRepository;
    private final TenantService tenantService;

    public List<TemplateResponse> listarPorImovel(UUID imovelId) {
        return templateRepository.findAllByImovelId(imovelId)
                .stream()
                .map(TemplateResponse::from)
                .toList();
    }

    @Transactional
    public TemplateResponse salvar(UUID imovelId, TemplateRequest request) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Imovel imovel = imovelRepository.findByIdAndTenantId(imovelId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        TemplateMensagem template = templateRepository
                .findByImovelIdAndTipoAndIdioma(imovelId, request.tipo(), request.idioma())
                .orElse(TemplateMensagem.builder().imovel(imovel).build());

        template.setTipo(request.tipo());
        template.setIdioma(request.idioma());
        template.setConteudo(request.conteudo());

        return TemplateResponse.from(templateRepository.save(template));
    }

    @Transactional
    public void excluir(UUID imovelId, UUID templateId) {
        TemplateMensagem template = templateRepository.findByIdAndImovelId(templateId, imovelId)
                .orElseThrow(() -> new IllegalArgumentException("Template não encontrado"));
        templateRepository.delete(template);
    }

    public WhatsAppLinkResponse gerarLink(UUID reservaId, TipoTemplate tipo, IdiomaTemplate idioma) {
        UUID tenantId = tenantService.getCurrentTenantId();

        Reserva reserva = reservaRepository.findByIdAndTenantId(reservaId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        Imovel imovel = reserva.getImovel();

        TemplateMensagem template = templateRepository
                .findByImovelIdAndTipoAndIdioma(imovel.getId(), tipo, idioma)
                .orElseThrow(() -> new IllegalArgumentException("Template não encontrado para este imóvel"));

        String mensagem = substituirVariaveis(template.getConteudo(), reserva, imovel);
        String telefone = reserva.getHospede().getTelefone() != null
                ? reserva.getHospede().getTelefone().replaceAll("[^0-9]", "")
                : "";

        String link = "https://wa.me/55" + telefone + "?text=" +
                URLEncoder.encode(mensagem, StandardCharsets.UTF_8);

        return new WhatsAppLinkResponse(link, mensagem);
    }

    private String substituirVariaveis(String conteudo, Reserva reserva, Imovel imovel) {
        return conteudo
                .replace("{{nome_hospede}}", reserva.getHospede().getNome())
                .replace("{{nome_imovel}}", imovel.getNome())
                .replace("{{endereco_imovel}}", imovel.getEndereco() != null ? imovel.getEndereco() : "")
                .replace("{{codigo_fechadura}}", imovel.getCodigoFechadura() != null ? imovel.getCodigoFechadura() : "")
                .replace("{{data_checkin}}", reserva.getDataCheckin().toString())
                .replace("{{data_checkout}}", reserva.getDataCheckout().toString())
                .replace("{{horario_checkin}}", "14:00")
                .replace("{{horario_checkout}}", "11:00")
                .replace("{{numero_pessoas}}", String.valueOf(reserva.getNumPessoas()));
    }
}
