package com.portotemp.api.dto;

import jakarta.validation.constraints.NotBlank;

public record HospedeRequest(

    @NotBlank(message = "Nome é obrigatório")
    String nome,

    String telefone,

    String email
) {}
