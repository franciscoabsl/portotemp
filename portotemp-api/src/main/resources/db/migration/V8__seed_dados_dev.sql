INSERT INTO tenant (id, nome, email, plano, ativo, criado_em)
VALUES ('00000000-0000-0000-0000-000000000001', 'Francisco Lima', 'francisco@portotemp.com', 'FREE', true, NOW());

INSERT INTO usuario (id, tenant_id, nome, email, senha_hash, role, ativo, criado_em)
VALUES ('00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000001',
        'Francisco Lima',
        'francisco@portotemp.com',
        '$2a$10$EMt6F6LoDe1QCakBQv139Oar7fK5mHrs1D/.IQtaGzY05hcx39oNS',
        'ADMIN', true, NOW());

INSERT INTO proprietario (id, tenant_id, nome, email, telefone, ativo, criado_em)
VALUES ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001',
        'João Silva', 'joao@email.com', '(81) 99999-1111', true, NOW()),
       ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001',
        'Maria Santos', 'maria@email.com', '(81) 99999-2222', true, NOW());

INSERT INTO imovel (id, tenant_id, proprietario_id, nome, endereco, codigo_fechadura,
                    taxa_limpeza_hospede, base_calculo_comissao, percentual_comissao,
                    resp_limpeza, resp_lavanderia, resp_despesas, ativo, criado_em)
VALUES ('00000000-0000-0000-0000-000000000020',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000010',
        'Apto Boa Viagem 101', 'Av. Boa Viagem, 101 - Recife/PE', '1234',
        150.00, 'LIQUIDO', 15.00, true, true, false, true, NOW()),
       ('00000000-0000-0000-0000-000000000021',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000011',
        'Apto Porto de Galinhas 202', 'Rua da Praia, 202 - Porto de Galinhas/PE', '5678',
        150.00, 'LIQUIDO', 10.00, true, true, false, true, NOW());

INSERT INTO hospede (id, tenant_id, nome, telefone, email, criado_em)
VALUES ('00000000-0000-0000-0000-000000000030',
        '00000000-0000-0000-0000-000000000001',
        'Carlos Pereira', '(81) 98888-1234', 'carlos@email.com', NOW()),
       ('00000000-0000-0000-0000-000000000031',
        '00000000-0000-0000-0000-000000000001',
        'Ana Paula', '(81) 97777-5678', 'ana.paula@email.com', NOW());
