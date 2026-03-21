CREATE TABLE proprietario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    cpf_cnpj VARCHAR(20),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE imovel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    proprietario_id UUID NOT NULL REFERENCES proprietario(id),
    nome VARCHAR(255) NOT NULL,
    endereco TEXT,
    codigo_fechadura VARCHAR(100),
    taxa_limpeza_hospede NUMERIC(10,2) NOT NULL DEFAULT 0,
    base_calculo_comissao VARCHAR(10) NOT NULL DEFAULT 'BRUTO',
    percentual_comissao NUMERIC(5,2) NOT NULL DEFAULT 0,
    resp_limpeza BOOLEAN NOT NULL DEFAULT FALSE,
    resp_lavanderia BOOLEAN NOT NULL DEFAULT FALSE,
    resp_despesas BOOLEAN NOT NULL DEFAULT FALSE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_base_calculo CHECK (base_calculo_comissao IN ('BRUTO', 'LIQUIDO'))
);

CREATE INDEX idx_proprietario_tenant_id ON proprietario(tenant_id);
CREATE INDEX idx_imovel_tenant_id ON imovel(tenant_id);
CREATE INDEX idx_imovel_proprietario_id ON imovel(proprietario_id);
