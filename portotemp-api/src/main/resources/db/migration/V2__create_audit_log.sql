CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    usuario_id UUID REFERENCES usuario(id),
    entidade VARCHAR(100) NOT NULL,
    entidade_id UUID NOT NULL,
    acao VARCHAR(20) NOT NULL,
    dados_anteriores JSONB,
    dados_novos JSONB,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_tenant_id ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_entidade ON audit_log(entidade, entidade_id);
CREATE INDEX idx_audit_log_criado_em ON audit_log(criado_em);
