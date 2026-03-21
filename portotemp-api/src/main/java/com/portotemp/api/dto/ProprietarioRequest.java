package com.portotemp.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProprietarioRequest(

    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @Email(message = "Email inválido")
    String email,

    String telefone,

    String cpfCnpj
) {}
