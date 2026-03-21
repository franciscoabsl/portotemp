package com.portotemp.api.dto;

import com.portotemp.api.domain.imovel.BaseCalculoComissao;
import com.portotemp.api.domain.imovel.Imovel;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ImovelResponse(
    UUID id,
    String nome,
    UUID proprietarioId,
    String proprietarioNome,
    String endereco,
    String codigoFechadura,
    BigDecimal taxaLimpezaHospede,
    BaseCalculoComissao baseCalculoComissao,
    BigDecimal percentualComissao,
    Boolean respLimpeza,
    Boolean respLavanderia,
    Boolean respDespesas,
    Boolean ativo,
    LocalDateTime criadoEm
) {
    public static ImovelResponse from(Imovel i) {
        return new ImovelResponse(
                i.getId(),
                i.getNome(),
                i.getProprietario().getId(),
                i.getProprietario().getNome(),
                i.getEndereco(),
                i.getCodigoFechadura(),
                i.getTaxaLimpezaHospede(),
                i.getBaseCalculoComissao(),
                i.getPercentualComissao(),
                i.getRespLimpeza(),
                i.getRespLavanderia(),
                i.getRespDespesas(),
                i.getAtivo(),
                i.getCriadoEm()
        );
    }
}
