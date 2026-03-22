package com.portotemp.api.controller;

import com.portotemp.api.domain.template.IdiomaTemplate;
import com.portotemp.api.domain.template.TipoTemplate;
import com.portotemp.api.dto.TemplateRequest;
import com.portotemp.api.dto.TemplateResponse;
import com.portotemp.api.dto.WhatsAppLinkResponse;
import com.portotemp.api.service.TemplateMensagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TemplateMensagemController {

    private final TemplateMensagemService templateService;

    @GetMapping("/imoveis/{imovelId}/templates")
    public ResponseEntity<List<TemplateResponse>> listar(@PathVariable UUID imovelId) {
        return ResponseEntity.ok(templateService.listarPorImovel(imovelId));
    }

    @PostMapping("/imoveis/{imovelId}/templates")
    public ResponseEntity<TemplateResponse> salvar(@PathVariable UUID imovelId,
                                                    @Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.ok(templateService.salvar(imovelId, request));
    }

    @DeleteMapping("/imoveis/{imovelId}/templates/{templateId}")
    public ResponseEntity<Void> excluir(@PathVariable UUID imovelId,
                                         @PathVariable UUID templateId) {
        templateService.excluir(imovelId, templateId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reservas/{reservaId}/whatsapp")
    public ResponseEntity<WhatsAppLinkResponse> gerarLink(
            @PathVariable UUID reservaId,
            @RequestParam TipoTemplate tipo,
            @RequestParam(defaultValue = "PT") IdiomaTemplate idioma) {
        return ResponseEntity.ok(templateService.gerarLink(reservaId, tipo, idioma));
    }
}
