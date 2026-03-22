package com.portotemp.api.repository;

import com.portotemp.api.domain.template.IdiomaTemplate;
import com.portotemp.api.domain.template.TemplateMensagem;
import com.portotemp.api.domain.template.TipoTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TemplateMensagemRepository extends JpaRepository<TemplateMensagem, UUID> {

    List<TemplateMensagem> findAllByImovelId(UUID imovelId);

    Optional<TemplateMensagem> findByImovelIdAndTipoAndIdioma(UUID imovelId, TipoTemplate tipo, IdiomaTemplate idioma);

    Optional<TemplateMensagem> findByIdAndImovelId(UUID id, UUID imovelId);
}
