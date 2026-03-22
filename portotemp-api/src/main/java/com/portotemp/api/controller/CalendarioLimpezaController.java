package com.portotemp.api.controller;

import com.portotemp.api.service.CalendarioLimpezaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/imoveis/{imovelId}/calendario-limpeza")
@RequiredArgsConstructor
public class CalendarioLimpezaController {

    private final CalendarioLimpezaService calendarioService;

    @GetMapping(produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> gerar(
            @PathVariable UUID imovelId,
            @RequestParam int mes,
            @RequestParam int ano) throws Exception {

        byte[] pdf = calendarioService.gerarPdf(imovelId, mes, ano);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=calendario-limpeza-" + mes + "-" + ano + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
