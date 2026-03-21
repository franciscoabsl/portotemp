CREATE TABLE hospede (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(255),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE prestador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    imovel_id UUID NOT NULL REFERENCES imovel(id),
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo VARCHAR(50) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_tipo_prestador CHECK (tipo IN ('LIMPEZA', 'LAVANDERIA'))
);

CREATE TABLE reserva (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    imovel_id UUID NOT NULL REFERENCES imovel(id),
    hospede_id UUID NOT NULL REFERENCES hospede(id),
    data_checkin DATE NOT NULL,
    data_checkout DATE NOT NULL,
    origem VARCHAR(20) NOT NULL DEFAULT 'DIRETO',
    valor_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    taxa_limpeza_hospede NUMERIC(10,2) NOT NULL DEFAULT 0,
    num_pessoas INT NOT NULL DEFAULT 1,
    observacoes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMADA',
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_datas CHECK (data_checkout > data_checkin),
    CONSTRAINT chk_origem CHECK (origem IN ('AIRBNB', 'BOOKING', 'DIRETO')),
    CONSTRAINT chk_status_reserva CHECK (status IN ('CONFIRMADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'))
);

CREATE INDEX idx_hospede_tenant_id ON hospede(tenant_id);
CREATE INDEX idx_prestador_tenant_id ON prestador(tenant_id);
CREATE INDEX idx_prestador_imovel_id ON prestador(imovel_id);
CREATE INDEX idx_reserva_tenant_id ON reserva(tenant_id);
CREATE INDEX idx_reserva_imovel_id ON reserva(imovel_id);
CREATE INDEX idx_reserva_datas ON reserva(data_checkin, data_checkout);
