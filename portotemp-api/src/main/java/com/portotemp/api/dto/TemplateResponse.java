package com.portotemp.api.dto;

import com.portotemp.api.domain.template.IdiomaTemplate;
import com.portotemp.api.domain.template.TemplateMensagem;
import com.portotemp.api.domain.template.TipoTemplate;

import java.util.UUID;

public record TemplateResponse(
    UUID id,
    UUID imovelId,
    String imovelNome,
    TipoTemplate tipo,
    IdiomaTemplate idioma,
    String conteudo
) {
    public static TemplateResponse from(TemplateMensagem t) {
        return new TemplateResponse(
                t.getId(),
                t.getImovel().getId(),
                t.getImovel().getNome(),
                t.getTipo(),
                t.getIdioma(),
                t.getConteudo()
        );
    }
}
