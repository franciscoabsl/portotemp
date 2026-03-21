CREATE TABLE cancelamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID NOT NULL REFERENCES reserva(id),
    data_cancelamento DATE NOT NULL DEFAULT CURRENT_DATE,
    valor_multa NUMERIC(10,2) NOT NULL DEFAULT 0,
    motivo TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE limpeza (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID NOT NULL REFERENCES reserva(id),
    prestador_id UUID REFERENCES prestador(id),
    data DATE NOT NULL,
    valor_pago NUMERIC(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_status_limpeza CHECK (status IN ('PENDENTE', 'CONCLUIDA'))
);

CREATE TABLE lavanderia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID NOT NULL REFERENCES reserva(id),
    prestador_id UUID REFERENCES prestador(id),
    data DATE NOT NULL,
    valor_pago NUMERIC(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_status_lavanderia CHECK (status IN ('PENDENTE', 'CONCLUIDA'))
);

CREATE INDEX idx_cancelamento_reserva_id ON cancelamento(reserva_id);
CREATE INDEX idx_limpeza_reserva_id ON limpeza(reserva_id);
CREATE INDEX idx_limpeza_data ON limpeza(data);
CREATE INDEX idx_lavanderia_reserva_id ON lavanderia(reserva_id);
CREATE INDEX idx_lavanderia_data ON lavanderia(data);
