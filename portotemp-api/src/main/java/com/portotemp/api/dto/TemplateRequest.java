package com.portotemp.api.dto;

import com.portotemp.api.domain.template.IdiomaTemplate;
import com.portotemp.api.domain.template.TipoTemplate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TemplateRequest(

    @NotNull(message = "Tipo é obrigatório")
    TipoTemplate tipo,

    @NotNull(message = "Idioma é obrigatório")
    IdiomaTemplate idioma,

    @NotBlank(message = "Conteúdo é obrigatório")
    String conteudo
) {}
