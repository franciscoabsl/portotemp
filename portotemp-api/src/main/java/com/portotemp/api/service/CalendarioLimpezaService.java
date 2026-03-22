package com.portotemp.api.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.portotemp.api.domain.imovel.Imovel;
import com.portotemp.api.domain.limpeza.Limpeza;
import com.portotemp.api.domain.reserva.Reserva;
import com.portotemp.api.repository.ImovelRepository;
import com.portotemp.api.repository.LimpezaRepository;
import com.portotemp.api.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CalendarioLimpezaService {

    private final ImovelRepository imovelRepository;
    private final LimpezaRepository limpezaRepository;
    private final ReservaRepository reservaRepository;
    private final TenantService tenantService;

    private static final BaseColor COR_LIMPEZA    = new BaseColor(198, 239, 206);
    private static final BaseColor COR_HOSPEDAGEM = new BaseColor(189, 215, 238);
    private static final BaseColor COR_VIRADA     = new BaseColor(255, 199, 199);
    private static final BaseColor COR_CABECALHO  = new BaseColor(220, 220, 220);
    private static final BaseColor COR_VAZIO      = BaseColor.WHITE;

    @Transactional(readOnly = true)
    public byte[] gerarPdf(UUID imovelId, int mes, int ano) throws Exception {
        UUID tenantId = tenantService.getCurrentTenantId();

        Imovel imovel = imovelRepository.findByIdAndTenantId(imovelId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Imovel nao encontrado"));

        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim    = inicio.withDayOfMonth(inicio.lengthOfMonth());

        List<Limpeza> limpezas = limpezaRepository
                .findAllByReserva_Imovel_TenantIdAndDataBetweenOrderByData(tenantId, inicio, fim)
                .stream()
                .filter(l -> l.getReserva().getImovel().getId().equals(imovelId))
                .toList();

        List<Reserva> reservas = reservaRepository
                .findAllByTenantIdAndImovelIdOrderByDataCheckinDesc(tenantId, imovelId)
                .stream()
                .filter(r -> !r.getDataCheckout().isBefore(inicio) && !r.getDataCheckin().isAfter(fim))
                .toList();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 40, 40, 50, 50);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.EMBEDDED);
        Font fTitulo    = new Font(bf, 16, Font.BOLD);
        Font fSubtitulo = new Font(bf, 12, Font.BOLD);
        Font fNormal    = new Font(bf, 10, Font.NORMAL);
        Font fBold      = new Font(bf, 10, Font.BOLD);
        Font fAviso     = new Font(bf, 10, Font.BOLD, new BaseColor(180, 0, 0));
        Font fPequenaBold = new Font(bf, 8, Font.BOLD);
        Font fLegenda   = new Font(bf, 9,  Font.NORMAL);

        String nomeMes = Month.of(mes).getDisplayName(TextStyle.FULL, new Locale("pt", "BR"));
        String nomeMesFormatado = nomeMes.substring(0, 1).toUpperCase() + nomeMes.substring(1);

        Paragraph titulo = new Paragraph(imovel.getNome(), fTitulo);
        titulo.setAlignment(Element.ALIGN_CENTER);
        doc.add(titulo);

        Paragraph subtitulo = new Paragraph(
                "Calendario de Limpeza - " + nomeMesFormatado + "/" + ano, fSubtitulo);
        subtitulo.setAlignment(Element.ALIGN_CENTER);
        subtitulo.setSpacingAfter(20);
        doc.add(subtitulo);

        if (!limpezas.isEmpty()) {
            PdfPTable tabela = new PdfPTable(new float[]{1.5f, 2.5f, 3.5f, 1f});
            tabela.setWidthPercentage(100);
            tabela.setSpacingBefore(10);

            for (String h : new String[]{"Data da Limpeza", "Hospede", "Periodo", "Hospedes"}) {
                PdfPCell cell = new PdfPCell(new Phrase(h, fBold));
                cell.setBackgroundColor(COR_CABECALHO);
                cell.setPadding(6);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                tabela.addCell(cell);
            }

            Limpeza anterior = null;
            for (Limpeza limpeza : limpezas) {
                Reserva r = limpeza.getReserva();
                boolean virada = anterior != null && anterior.getData().equals(limpeza.getData());

                LocalDate data = limpeza.getData();
                String dataStr = String.format("%02d/%02d/%04d",
                        data.getDayOfMonth(), data.getMonthValue(), data.getYear());
                String periodo = formatarPeriodo(r.getDataCheckin(), r.getDataCheckout());

                BaseColor cor  = virada ? COR_VIRADA : BaseColor.WHITE;
                Font fonte     = virada ? fAviso : fNormal;
                String prefixo = virada ? "[!] " : "";

                for (String texto : new String[]{
                        dataStr, prefixo + r.getHospede().getNome(),
                        periodo, String.valueOf(r.getNumPessoas())}) {
                    PdfPCell cell = new PdfPCell(new Phrase(texto, fonte));
                    cell.setPadding(6);
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    cell.setBackgroundColor(cor);
                    tabela.addCell(cell);
                }
                anterior = limpeza;
            }
            doc.add(tabela);
        } else {
            doc.add(new Paragraph("Nenhuma limpeza agendada para este periodo.", fNormal));
        }

        doc.add(Chunk.NEWLINE);
        Paragraph tituloCalendario = new Paragraph("Calendario", fSubtitulo);
        tituloCalendario.setSpacingBefore(10);
        tituloCalendario.setSpacingAfter(8);
        doc.add(tituloCalendario);

        PdfPTable calendario = new PdfPTable(7);
        calendario.setWidthPercentage(100);

        String[] diasSemana = {"Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"};
        for (String d : diasSemana) {
            PdfPCell cell = new PdfPCell(new Phrase(d, fBold));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(COR_CABECALHO);
            cell.setPadding(5);
            calendario.addCell(cell);
        }

        YearMonth ym = YearMonth.of(ano, mes);
        int primeiroDia = LocalDate.of(ano, mes, 1).getDayOfWeek().getValue() % 7;

        for (int i = 0; i < primeiroDia; i++) {
            PdfPCell cell = new PdfPCell();
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setFixedHeight(48);
            calendario.addCell(cell);
        }

        List<LocalDate> diasLimpeza = limpezas.stream().map(Limpeza::getData).distinct().toList();
        List<LocalDate> diasVirada  = limpezas.stream()
                .filter(l -> limpezas.stream().filter(x -> x.getData().equals(l.getData())).count() > 1)
                .map(Limpeza::getData).distinct().toList();

        for (int dia = 1; dia <= ym.lengthOfMonth(); dia++) {
            LocalDate data = LocalDate.of(ano, mes, dia);

            boolean limpezaHoje  = diasLimpeza.contains(data);
            boolean viradaHoje   = diasVirada.contains(data);
            boolean checkinHoje  = reservas.stream().anyMatch(r -> r.getDataCheckin().equals(data));
            boolean checkoutHoje = reservas.stream().anyMatch(r -> r.getDataCheckout().equals(data));
            boolean hospedagemAtiva = reservas.stream()
                    .anyMatch(r -> !data.isBefore(r.getDataCheckin()) && data.isBefore(r.getDataCheckout()));

            BaseColor corManha = (checkoutHoje || (hospedagemAtiva && !checkinHoje))
                    ? COR_HOSPEDAGEM : COR_VAZIO;

            BaseColor corTarde;
            if (viradaHoje)          corTarde = COR_VIRADA;
            else if (limpezaHoje)    corTarde = COR_LIMPEZA;
            else if (checkinHoje)    corTarde = COR_HOSPEDAGEM;
            else if (hospedagemAtiva) corTarde = COR_HOSPEDAGEM;
            else                     corTarde = COR_VAZIO;

            PdfPTable nested = new PdfPTable(2);
            nested.setWidthPercentage(100);

            PdfPCell manha = new PdfPCell();
            manha.setBackgroundColor(corManha);
            manha.setBorder(Rectangle.NO_BORDER);
            manha.setFixedHeight(44);
            nested.addCell(manha);

            PdfPCell tarde = new PdfPCell();
            tarde.setBackgroundColor(corTarde);
            tarde.setBorder(Rectangle.NO_BORDER);
            tarde.setFixedHeight(44);
            Paragraph numDia = new Paragraph(String.valueOf(dia), fPequenaBold);
            numDia.setAlignment(Element.ALIGN_CENTER);
            tarde.addElement(numDia);
            nested.addCell(tarde);

            PdfPCell diaCell = new PdfPCell(nested);
            diaCell.setPadding(0);
            diaCell.setFixedHeight(44);
            calendario.addCell(diaCell);
        }

        int totalCelulas  = primeiroDia + ym.lengthOfMonth();
        int diasRestantes = (7 - (totalCelulas % 7)) % 7;
        for (int i = 0; i < diasRestantes; i++) {
            PdfPCell cell = new PdfPCell();
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setFixedHeight(44);
            calendario.addCell(cell);
        }

        doc.add(calendario);

        // Legenda alinhada à esquerda, sem percentagem excessiva
        doc.add(Chunk.NEWLINE);
        PdfPTable legenda = new PdfPTable(new float[]{0.4f, 5f});
        legenda.setWidthPercentage(100);
        legenda.setHorizontalAlignment(Element.ALIGN_LEFT);
        legenda.setSpacingBefore(10);

        adicionarLegenda(legenda, COR_HOSPEDAGEM, "Hospedagem", fLegenda);
        adicionarLegenda(legenda, COR_LIMPEZA,    "Limpeza", fLegenda);
        adicionarLegenda(legenda, COR_VIRADA,     "Limpeza Entrada/Saida", fAviso);

        doc.add(legenda);
        doc.close();
        return baos.toByteArray();
    }

    private String formatarPeriodo(LocalDate checkin, LocalDate checkout) {
        return formatarData(checkin) + " a " + formatarData(checkout);
    }

    private String formatarData(LocalDate data) {
        return String.format("%02d/%02d/%04d",
                data.getDayOfMonth(), data.getMonthValue(), data.getYear());
    }

    private void adicionarLegenda(PdfPTable tabela, BaseColor cor, String texto, Font fonte) {
        PdfPCell corCell = new PdfPCell(new Phrase(" "));
        corCell.setBackgroundColor(cor);
        corCell.setPadding(6);
        tabela.addCell(corCell);

        PdfPCell textoCell = new PdfPCell(new Phrase(texto, fonte));
        textoCell.setBorder(Rectangle.NO_BORDER);
        textoCell.setPaddingLeft(6);
        textoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        tabela.addCell(textoCell);
    }
}
