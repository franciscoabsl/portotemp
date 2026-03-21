CREATE TABLE despesa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    imovel_id UUID NOT NULL REFERENCES imovel(id),
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT,
    valor NUMERIC(10,2) NOT NULL DEFAULT 0,
    competencia DATE NOT NULL,
    status_pagamento VARCHAR(20) NOT NULL DEFAULT 'PAGO',
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_status_despesa CHECK (status_pagamento IN ('PAGO', 'PENDENTE'))
);

CREATE TABLE fechamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    proprietario_id UUID NOT NULL REFERENCES proprietario(id),
    mes INT NOT NULL,
    ano INT NOT NULL,
    total_comissao NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_reembolsos NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_a_receber NUMERIC(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    gerado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_status_fechamento CHECK (status IN ('ABERTO', 'FECHADO')),
    CONSTRAINT chk_mes CHECK (mes BETWEEN 1 AND 12),
    UNIQUE (tenant_id, proprietario_id, mes, ano)
);

CREATE TABLE fechamento_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fechamento_id UUID NOT NULL REFERENCES fechamento(id),
    tipo VARCHAR(30) NOT NULL,
    referencia_id UUID,
    descricao TEXT NOT NULL,
    valor NUMERIC(10,2) NOT NULL DEFAULT 0,
    CONSTRAINT chk_tipo_item CHECK (tipo IN ('COMISSAO', 'LIMPEZA', 'LAVANDERIA', 'DESPESA', 'MULTA'))
);

CREATE INDEX idx_despesa_tenant_id ON despesa(tenant_id);
CREATE INDEX idx_despesa_imovel_id ON despesa(imovel_id);
CREATE INDEX idx_despesa_competencia ON despesa(competencia);
CREATE INDEX idx_fechamento_tenant_id ON fechamento(tenant_id);
CREATE INDEX idx_fechamento_proprietario_id ON fechamento(proprietario_id);
CREATE INDEX idx_fechamento_item_fechamento_id ON fechamento_item(fechamento_id);
