package com.portotemp.api.dto;

import com.portotemp.api.domain.prestador.TipoPrestador;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PrestadorRequest(

    @NotBlank(message = "Nome é obrigatório")
    String nome,

    String telefone,

    @NotNull(message = "Tipo é obrigatório")
    TipoPrestador tipo,

    @NotNull(message = "Imóvel é obrigatório")
    UUID imovelId
) {}
