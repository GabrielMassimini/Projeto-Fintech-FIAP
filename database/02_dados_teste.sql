-- =====================================================================
-- MassPay - dados de teste
-- Rode DEPOIS do 01_criar_banco_masspay.sql (que apaga e recria tudo).
--
-- Usuário de teste (login no frontend):
--   e-mail: teste@masspay.com
--   senha:  MassPay@2026
-- No banco fica só o hash SHA-256 da senha, igual ao que o backend gera.
--
-- As datas são relativas a hoje (SYSDATE), para os lançamentos sempre
-- aparecerem como recentes. Os saldos já refletem as transações e os
-- investimentos abaixo, seguindo as mesmas regras do backend.
-- =====================================================================

INSERT INTO USUARIO (id_usuario, nome_completo, cpf, data_nascimento, email, telefone, senha_hash, data_cadastro, status)
VALUES (SEQ_USUARIO.NEXTVAL, 'Usuário Teste MassPay', '12345678909', DATE '1998-05-10', 'teste@masspay.com', '11987654321',
        'a407cdfc49632cb2868a382d0334939cb836adb88183f9a0f1619441d832d976', TRUNC(SYSDATE) - 30, 'ATIVO');

-- Conta corrente: abre com R$ 2.000,00 e termina com R$ 4.684,75
INSERT INTO CONTA_MASSPAY (id_conta, USUARIO_id_usuario, numero_conta, agencia, tipo_conta, saldo_disponivel, saldo_bloqueado, saldo_total, data_abertura, status_conta)
VALUES (SEQ_CONTA_MASSPAY.NEXTVAL, (SELECT id_usuario FROM USUARIO WHERE email = 'teste@masspay.com'),
        '10001-0', '0001', 'CORRENTE', 4684.75, 0, 4684.75, TRUNC(SYSDATE) - 30, 'ATIVA');

-- Conta poupança, sem movimentações
INSERT INTO CONTA_MASSPAY (id_conta, USUARIO_id_usuario, numero_conta, agencia, tipo_conta, saldo_disponivel, saldo_bloqueado, saldo_total, data_abertura, status_conta)
VALUES (SEQ_CONTA_MASSPAY.NEXTVAL, (SELECT id_usuario FROM USUARIO WHERE email = 'teste@masspay.com'),
        '10002-8', '0001', 'POUPANCA', 1500, 0, 1500, TRUNC(SYSDATE) - 30, 'ATIVA');

-- Movimentações da conta corrente, em ordem (saldo_apos = saldo logo depois de cada uma)
--  2.000,00 + 4.800,00 salário      = 6.800,00
--           - 1.350,00 aluguel      = 5.450,00
--           - 1.000,00 CDB          = 4.450,00
--           -   412,35 mercado      = 4.037,65
--           -   750,00 Tesouro      = 3.287,65
--           + 1.500,00 freelance    = 4.787,65
--           -    38,90 corrida      = 4.748,75
--           -    64,00 cinema       = 4.684,75
INSERT INTO TRANSACAO (id_transacao, CONTA_MASSPAY_id_conta, CATEGORIA_TRANSACAO_id_categoria, descricao, tipo_transacao, valor, data_transacao, status_transacao, saldo_apos, detalhes)
VALUES (SEQ_TRANSACAO.NEXTVAL, (SELECT id_conta FROM CONTA_MASSPAY WHERE numero_conta = '10001-0'),
        (SELECT id_categoria FROM CATEGORIA_TRANSACAO WHERE nome_categoria = 'Salario'),
        'Salário', 'RECEITA', 4800, TRUNC(SYSDATE) - 25, 'CONCLUIDA', 6800, 'Pagamento mensal');

INSERT INTO TRANSACAO (id_transacao, CONTA_MASSPAY_id_conta, CATEGORIA_TRANSACAO_id_categoria, descricao, tipo_transacao, valor, data_transacao, status_transacao, saldo_apos, detalhes)
VALUES (SEQ_TRANSACAO.NEXTVAL, (SELECT id_conta FROM CONTA_MASSPAY WHERE numero_conta = '10001-0'),
        (SELECT id_categoria FROM CATEGORIA_TRANSACAO WHERE nome_categoria = 'Moradia'),
        'Aluguel', 'DESPESA', 1350, TRUNC(SYSDATE) - 23, 'CONCLUIDA', 5450, NULL);

INSERT INTO TRANSACAO (id_transacao, CONTA_MASSPAY_id_conta, CATEGORIA_TRANSACAO_id_categoria, descricao, tipo_transacao, valor, data_transacao, status_transacao, saldo_apos, detalhes)
VALUES (SEQ_TRANSACAO.NEXTVAL, (SELECT id_conta FROM CONTA_MASSPAY WHERE numero_conta = '10001-0'),
        (SELECT id_categoria FROM CATEGORIA_TRANSACAO WHERE nome_categoria = 'Alimentacao'),
        'Supermercado Bom Preço', 'DESPESA', 412.35, TRUNC(SYSDATE) - 18, 'CONCLUIDA', 4037.65, 'Compra do mês');

INSERT INTO TRANSACAO (id_transacao, CONTA_MASSPAY_id_conta, CATEGORIA_TRANSACAO_id_categoria, descricao, tipo_transacao, valor, data_transacao, status_transacao, saldo_apos, detalhes)
VALUES (SEQ_TRANSACAO.NEXTVAL, (SELECT id_conta FROM CONTA_MASSPAY WHERE numero_conta = '10001-0'),
        (SELECT id_categoria FROM CATEGORIA_TRANSACAO WHERE nome_categoria = 'Freelance'),
        'Projeto freelance', 'RECEITA', 1500, TRUNC(SYSDATE) - 12, 'CONCLUIDA', 4787.65, 'Site para cliente');

INSERT INTO TRANSACAO (id_transacao, CONTA_MASSPAY_id_conta, CATEGORIA_TRANSACAO_id_categoria, descricao, tipo_transacao, valor, data_transacao, status_transacao, saldo_apos, detalhes)
VALUES (SEQ_TRANSACAO.NEXTVAL, (SELECT id_conta FROM CONTA_MASSPAY WHERE numero_conta = '10001-0'),
        (SELECT id_categoria FROM CATEGORIA_TRANSACAO WHERE nome_categoria = 'Transporte'),
        'Corrida de aplicativo', 'DESPESA', 38.90, TRUNC(SYSDATE) - 6, 'CONCLUIDA', 4748.75, NULL);

INSERT INTO TRANSACAO (id_transacao, CONTA_MASSPAY_id_conta, CATEGORIA_TRANSACAO_id_categoria, descricao, tipo_transacao, valor, data_transacao, status_transacao, saldo_apos, detalhes)
VALUES (SEQ_TRANSACAO.NEXTVAL, (SELECT id_conta FROM CONTA_MASSPAY WHERE numero_conta = '10001-0'),
        (SELECT id_categoria FROM CATEGORIA_TRANSACAO WHERE nome_categoria = 'Lazer'),
        'Cinema', 'DESPESA', 64, TRUNC(SYSDATE) - 2, 'CONCLUIDA', 4684.75, NULL);

-- Investimentos ativos (o valor aplicado já saiu do saldo da conta corrente)
INSERT INTO INVESTIMENTO (id_investimento, id_conta, tipo_investimento, nome_investimento, valor_aplicado, rendimento, percentual_rendimento, data_aplicacao, data_vencimento, liquidez, status_investimento, data_cadastro)
VALUES (SEQ_INVESTIMENTO.NEXTVAL, (SELECT id_conta FROM CONTA_MASSPAY WHERE numero_conta = '10001-0'),
        'CDB', 'CDB MassPay 2028', 1000, NULL, 12.5, TRUNC(SYSDATE) - 21, ADD_MONTHS(TRUNC(SYSDATE), 26), 'VENCIMENTO', 'ATIVO', TRUNC(SYSDATE) - 21);

INSERT INTO INVESTIMENTO (id_investimento, id_conta, tipo_investimento, nome_investimento, valor_aplicado, rendimento, percentual_rendimento, data_aplicacao, data_vencimento, liquidez, status_investimento, data_cadastro)
VALUES (SEQ_INVESTIMENTO.NEXTVAL, (SELECT id_conta FROM CONTA_MASSPAY WHERE numero_conta = '10001-0'),
        'TESOURO', 'Tesouro Selic 2029', 750, NULL, 10.75, TRUNC(SYSDATE) - 16, ADD_MONTHS(TRUNC(SYSDATE), 30), 'DIARIA', 'ATIVO', TRUNC(SYSDATE) - 16);

COMMIT;

SELECT (SELECT COUNT(*) FROM USUARIO)       AS usuarios,
       (SELECT COUNT(*) FROM CONTA_MASSPAY) AS contas,
       (SELECT COUNT(*) FROM TRANSACAO)     AS transacoes,
       (SELECT COUNT(*) FROM INVESTIMENTO)  AS investimentos
  FROM DUAL;
