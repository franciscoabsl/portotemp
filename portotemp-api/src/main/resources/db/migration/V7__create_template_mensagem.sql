CREATE TABLE template_mensagem (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imovel_id UUID NOT NULL REFERENCES imovel(id),
    tipo VARCHAR(30) NOT NULL,
    idioma VARCHAR(5) NOT NULL DEFAULT 'PT',
    conteudo TEXT NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_tipo_template CHECK (tipo IN ('CONFIRMACAO', 'VESPERA_CHECKIN', 'BOAS_VINDAS', 'CHECKOUT')),
    CONSTRAINT chk_idioma CHECK (idioma IN ('PT', 'EN', 'ES')),
    UNIQUE (imovel_id, tipo, idioma)
);

CREATE INDEX idx_template_mensagem_imovel_id ON template_mensagem(imovel_id);
