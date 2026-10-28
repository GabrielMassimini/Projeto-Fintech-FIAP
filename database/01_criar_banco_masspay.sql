BEGIN
    FOR t IN (SELECT table_name FROM user_tables
               WHERE table_name IN ('USUARIO','CATEGORIA_TRANSACAO','CONTA_MASSPAY','ENDERECO_USUARIO','PREFERENCIAS_USUARIO','CONTATO_FAVORITO','META_FINANCEIRA','DISPOSITIVO_CONECTADO','CONTA_VINCULADA','CARTAO','LIMITE_CONTA','INVESTIMENTO','TRANSACAO','TRANSFERENCIA_AGENDADA')) LOOP
        EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS';
    END LOOP;
    FOR s IN (SELECT sequence_name FROM user_sequences
               WHERE sequence_name IN ('SEQ_USUARIO','SEQ_CATEGORIA_TRANSACAO','SEQ_CONTA_MASSPAY','SEQ_ENDERECO_USUARIO','SEQ_PREFERENCIAS_USUARIO','SEQ_CONTATO_FAVORITO','SEQ_META_FINANCEIRA','SEQ_DISPOSITIVO_CONECTADO','SEQ_CONTA_VINCULADA','SEQ_CARTAO','SEQ_LIMITE_CONTA','SEQ_INVESTIMENTO','SEQ_TRANSACAO','SEQ_TRANSFERENCIA_AGENDADA')) LOOP
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
    END LOOP;
END;
/


CREATE TABLE USUARIO (
    id_usuario       NUMBER(10) NOT NULL,
    nome_completo    VARCHAR2(150 CHAR) NOT NULL,
    cpf              CHAR(11 CHAR) NOT NULL,
    data_nascimento  DATE NOT NULL,
    email            VARCHAR2(150 CHAR) NOT NULL,
    telefone         VARCHAR2(20 CHAR),
    senha_hash       VARCHAR2(255 CHAR) NOT NULL,
    data_cadastro    DATE NOT NULL,
    status           VARCHAR2(20 CHAR) NOT NULL,
    CONSTRAINT USUARIO_PK PRIMARY KEY (id_usuario),
    CONSTRAINT USUARIO_cpf_UN UNIQUE (cpf),
    CONSTRAINT USUARIO_email_UN UNIQUE (email)
);

CREATE TABLE CATEGORIA_TRANSACAO (
    id_categoria       NUMBER(10) NOT NULL,
    nome_categoria     VARCHAR2(50 CHAR) NOT NULL,
    descricao          VARCHAR2(200 CHAR),
    tipo_movimentacao  VARCHAR2(10 CHAR) NOT NULL,
    ativo              CHAR(1 CHAR) NOT NULL,
    data_cadastro      DATE NOT NULL,
    CONSTRAINT CATEGORIA_TRANSACAO_PK PRIMARY KEY (id_categoria),
    CONSTRAINT CATEGORIA_TRANSACAO_NOME_UN UNIQUE (nome_categoria)
);

CREATE TABLE CONTA_MASSPAY (
    id_conta            NUMBER(10) NOT NULL,
    USUARIO_id_usuario  NUMBER(10) NOT NULL,
    numero_conta        VARCHAR2(10 CHAR) NOT NULL,
    agencia             VARCHAR2(5 CHAR) NOT NULL,
    tipo_conta          VARCHAR2(30 CHAR) NOT NULL,
    saldo_disponivel    NUMBER(15,2) NOT NULL,
    saldo_bloqueado     NUMBER(15,2) NOT NULL,
    saldo_total         NUMBER(15,2) NOT NULL,
    data_abertura       DATE NOT NULL,
    status_conta        VARCHAR2(20 CHAR) NOT NULL,
    CONSTRAINT CONTA_MASSPAY_PK PRIMARY KEY (id_conta),
    CONSTRAINT CONTA_MASSPAY_numero_conta_UN UNIQUE (numero_conta),
    CONSTRAINT CONTA_MASSPAY_USUARIO_FK FOREIGN KEY (USUARIO_id_usuario) REFERENCES USUARIO (id_usuario)
);

CREATE TABLE ENDERECO_USUARIO (
    id_endereco         NUMBER(10) NOT NULL,
    USUARIO_id_usuario  NUMBER(10) NOT NULL,
    logradouro          VARCHAR2(150 CHAR) NOT NULL,
    numero              VARCHAR2(10 CHAR) NOT NULL,
    complemento         VARCHAR2(50 CHAR),
    bairro              VARCHAR2(100 CHAR) NOT NULL,
    cidade              VARCHAR2(100 CHAR) NOT NULL,
    estado              CHAR(2 CHAR) NOT NULL,
    cep                 VARCHAR2(9 CHAR) NOT NULL,
    tipo_endereco       VARCHAR2(20 CHAR) NOT NULL,
    principal           CHAR(1 CHAR) NOT NULL,
    data_cadastro       DATE NOT NULL,
    CONSTRAINT ENDERECO_USUARIO_PK PRIMARY KEY (id_endereco),
    CONSTRAINT ENDERECO_USUARIO_USUARIO_FK FOREIGN KEY (USUARIO_id_usuario) REFERENCES USUARIO (id_usuario)
);

CREATE TABLE PREFERENCIAS_USUARIO (
    id_preferencias     NUMBER(10) NOT NULL,
    USUARIO_id_usuario  NUMBER(10) NOT NULL,
    notificar_email     CHAR(1 CHAR) NOT NULL,
    notificar_sms       CHAR(1 CHAR) NOT NULL,
    tema_escuro         CHAR(1 CHAR) NOT NULL,
    data_atualizacao    DATE NOT NULL,
    CONSTRAINT PREFERENCIAS_USUARIO_PK PRIMARY KEY (id_preferencias),
    CONSTRAINT PREFERENCIAS_USUARIO_UN UNIQUE (USUARIO_id_usuario),
    CONSTRAINT PREFERENCIAS_USUARIO_FK FOREIGN KEY (USUARIO_id_usuario) REFERENCES USUARIO (id_usuario)
);

CREATE TABLE CONTATO_FAVORITO (
    id_contato          NUMBER(10) NOT NULL,
    USUARIO_id_usuario  NUMBER(10) NOT NULL,
    conta_no            VARCHAR2(30 CHAR) NOT NULL,
    nome_contato        VARCHAR2(150 CHAR) NOT NULL,
    apelido             VARCHAR2(100 CHAR),
    chave_pix           VARCHAR2(150 CHAR),
    tipo_chave_pix      VARCHAR2(20 CHAR),
    data_cadastro       DATE NOT NULL,
    ativo               CHAR(1 CHAR) NOT NULL,
    CONSTRAINT CONTATO_FAVORITO_PK PRIMARY KEY (id_contato),
    CONSTRAINT CONTATO_FAVORITO_UN UNIQUE (USUARIO_id_usuario, conta_no),
    CONSTRAINT CONTATO_FAVORITO_USUARIO_FK FOREIGN KEY (USUARIO_id_usuario) REFERENCES USUARIO (id_usuario)
);

CREATE TABLE META_FINANCEIRA (
    id_meta         NUMBER(10) NOT NULL,
    id_usuario      NUMBER(10) NOT NULL,
    nome_meta       VARCHAR2(100 CHAR) NOT NULL,
    descricao       VARCHAR2(200 CHAR),
    valor_objetivo  NUMBER(15,2) NOT NULL,
    valor_atual     NUMBER(15,2) NOT NULL,
    data_inicio     DATE NOT NULL,
    data_meta       DATE NOT NULL,
    status_meta     VARCHAR2(20 CHAR) NOT NULL,
    ativa           CHAR(1 CHAR) NOT NULL,
    data_cadastro   DATE NOT NULL,
    CONSTRAINT META_FINANCEIRA_PK PRIMARY KEY (id_meta),
    CONSTRAINT UQ_META_USUARIO_NOME UNIQUE (id_usuario, nome_meta),
    CONSTRAINT META_FINANCEIRA_USUARIO_FK FOREIGN KEY (id_usuario) REFERENCES USUARIO (id_usuario),
    CONSTRAINT CK_META_VALORES CHECK (VALOR_OBJETIVO > 0 AND VALOR_ATUAL >= 0),
    CONSTRAINT CK_META_STATUS CHECK (STATUS_META IN ('EM ANDAMENTO','CONCLUIDA','CANCELADA')),
    CONSTRAINT CK_META_ATIVA CHECK (ATIVA IN ('S','N')),
    CONSTRAINT CK_META_DATAS CHECK (DATA_META >= DATA_INICIO)
);

CREATE TABLE DISPOSITIVO_CONECTADO (
    id_dispositivo      NUMBER(10) NOT NULL,
    USUARIO_id_usuario  NUMBER(10) NOT NULL,
    tipo_dispositivo    VARCHAR2(20 CHAR) NOT NULL,
    descricao_disp      VARCHAR2(100 CHAR),
    ip_ultimo_acesso    VARCHAR2(45 CHAR),
    data_ultimo_acesso  DATE,
    data_cadastro       DATE NOT NULL,
    ativo               CHAR(1 CHAR) NOT NULL,
    CONSTRAINT DISPOSITIVO_CONECTADO_PK PRIMARY KEY (id_dispositivo),
    CONSTRAINT DISPOSITIVO_USUARIO_FK FOREIGN KEY (USUARIO_id_usuario) REFERENCES USUARIO (id_usuario)
);

CREATE TABLE CONTA_VINCULADA (
    id_conta_vinculada  NUMBER(10) NOT NULL,
    USUARIO_id_usuario  NUMBER(10) NOT NULL,
    apelido             VARCHAR2(100 CHAR) NOT NULL,
    nome_titular        VARCHAR2(150 CHAR) NOT NULL,
    cpf_cnpj_titular    VARCHAR2(14 CHAR) NOT NULL,
    banco               VARCHAR2(50 CHAR) NOT NULL,
    agencia             VARCHAR2(10 CHAR) NOT NULL,
    numero_conta        VARCHAR2(20 CHAR) NOT NULL,
    tipo_conta          VARCHAR2(30 CHAR) NOT NULL,
    ativa               CHAR(1 CHAR) NOT NULL,
    data_cadastro       DATE NOT NULL,
    CONSTRAINT CONTA_VINCULADA_PK PRIMARY KEY (id_conta_vinculada),
    CONSTRAINT CONTA_VINCULADA_UN UNIQUE (USUARIO_id_usuario, apelido),
    CONSTRAINT CONTA_VINCULADA_USUARIO_FK FOREIGN KEY (USUARIO_id_usuario) REFERENCES USUARIO (id_usuario)
);

CREATE TABLE CARTAO (
    id_cartao               NUMBER(10) NOT NULL,
    CONTA_MASSPAY_id_conta  NUMBER(10) NOT NULL,
    numero_cartao           VARCHAR2(16 CHAR) NOT NULL,
    nome_titular            VARCHAR2(150 CHAR) NOT NULL,
    data_validade           DATE NOT NULL,
    cvv_hash                VARCHAR2(255 CHAR) NOT NULL,
    tipo_cartao             VARCHAR2(10 CHAR) NOT NULL,
    bandeira                VARCHAR2(20 CHAR) NOT NULL,
    limite_total            NUMBER(15,2),
    limite_disponivel       NUMBER(15,2),
    status_cartao           VARCHAR2(20 CHAR) NOT NULL,
    data_emissao            DATE NOT NULL,
    CONSTRAINT CARTAO_PK PRIMARY KEY (id_cartao),
    CONSTRAINT CARTAO_numero_cartao_UN UNIQUE (numero_cartao),
    CONSTRAINT CARTAO_CONTA_MASSPAY_FK FOREIGN KEY (CONTA_MASSPAY_id_conta) REFERENCES CONTA_MASSPAY (id_conta)
);

CREATE TABLE LIMITE_CONTA (
    id_limite               NUMBER(10) NOT NULL,
    CONTA_MASSPAY_id_conta  NUMBER(10) NOT NULL,
    tipo_limite             VARCHAR2(30 CHAR) NOT NULL,
    valor_limite            NUMBER(15,2) NOT NULL,
    valor_utilizado         NUMBER(15,2),
    periodo                 VARCHAR2(20 CHAR) NOT NULL,
    ativo                   CHAR(1 CHAR) NOT NULL,
    data_inicio             DATE,
    data_final              DATE,
    data_atualizacao        DATE NOT NULL,
    CONSTRAINT LIMITE_CONTA_PK PRIMARY KEY (id_limite),
    CONSTRAINT LIMITE_CONTA_UN UNIQUE (CONTA_MASSPAY_id_conta, tipo_limite, periodo),
    CONSTRAINT LIMITE_CONTA_CONTA_MASSPAY_FK FOREIGN KEY (CONTA_MASSPAY_id_conta) REFERENCES CONTA_MASSPAY (id_conta)
);

CREATE TABLE INVESTIMENTO (
    id_investimento        NUMBER(10) NOT NULL,
    id_conta               NUMBER(10) NOT NULL,
    tipo_investimento      VARCHAR2(30 CHAR) NOT NULL,
    nome_investimento      VARCHAR2(100 CHAR) NOT NULL,
    valor_aplicado         NUMBER(15,2) NOT NULL,
    rendimento             NUMBER(15,2),
    percentual_rendimento  NUMBER(5,2),
    data_aplicacao         DATE NOT NULL,
    data_vencimento        DATE,
    liquidez               VARCHAR2(20 CHAR),
    status_investimento    VARCHAR2(20 CHAR) NOT NULL,
    data_cadastro          DATE NOT NULL,
    CONSTRAINT INVESTIMENTO_PK PRIMARY KEY (id_investimento),
    CONSTRAINT UQ_INVEST_CONTA_NOME UNIQUE (id_conta, nome_investimento),
    CONSTRAINT INVESTIMENTO_CONTA_MASSPAY_FK FOREIGN KEY (id_conta) REFERENCES CONTA_MASSPAY (id_conta),
    CONSTRAINT CK_INVEST_VALOR CHECK (VALOR_APLICADO > 0),
    CONSTRAINT CK_INVEST_RENDIMENTO CHECK (RENDIMENTO IS NULL OR RENDIMENTO >= 0),
    CONSTRAINT CK_INVEST_PERCENTUAL CHECK (PERCENTUAL_RENDIMENTO IS NULL OR PERCENTUAL_RENDIMENTO >= 0),
    CONSTRAINT CK_INVEST_TIPO CHECK (TIPO_INVESTIMENTO IN ('CDB','CDI','TESOURO','POUPANCA','ACOES','FUNDO')),
    CONSTRAINT CK_INVEST_LIQUIDEZ CHECK (LIQUIDEZ IS NULL OR LIQUIDEZ IN ('DIARIA','VENCIMENTO','IMEDIATA')),
    CONSTRAINT CK_INVEST_STATUS CHECK (STATUS_INVESTIMENTO IN ('ATIVO','RESGATADO','ENCERRADO')),
    CONSTRAINT CK_INVEST_DATAS CHECK (DATA_VENCIMENTO IS NULL OR DATA_VENCIMENTO >= DATA_APLICACAO)
);

CREATE TABLE TRANSACAO (
    id_transacao                      NUMBER(10) NOT NULL,
    CONTA_MASSPAY_id_conta            NUMBER(10) NOT NULL,
    CATEGORIA_TRANSACAO_id_categoria  NUMBER(10) NOT NULL,
    descricao                         VARCHAR2(200 CHAR) NOT NULL,
    tipo_transacao                    VARCHAR2(10 CHAR) NOT NULL,
    valor                             NUMBER(15,2) NOT NULL,
    data_transacao                    DATE NOT NULL,
    status_transacao                  VARCHAR2(20 CHAR) NOT NULL,
    saldo_apos                        NUMBER(15,2),
    detalhes                          VARCHAR2(4000 CHAR),
    CONSTRAINT TRANSACAO_PK PRIMARY KEY (id_transacao),
    CONSTRAINT TRANSACAO_CONTA_MASSPAY_FK FOREIGN KEY (CONTA_MASSPAY_id_conta) REFERENCES CONTA_MASSPAY (id_conta),
    CONSTRAINT TRANSACAO_CATEGORIA_FK FOREIGN KEY (CATEGORIA_TRANSACAO_id_categoria) REFERENCES CATEGORIA_TRANSACAO (id_categoria)
);

CREATE TABLE TRANSFERENCIA_AGENDADA (
    id_agendamento                    NUMBER(10) NOT NULL,
    CONTA_MASSPAY_id_conta            NUMBER(10) NOT NULL,
    CATEGORIA_TRANSACAO_id_categoria  NUMBER(10) NOT NULL,
    valor                             NUMBER(15,2) NOT NULL,
    data_agendamento                  DATE NOT NULL,
    data_execucao                     DATE NOT NULL,
    status_agendamento                VARCHAR2(20 CHAR) NOT NULL,
    nome_destinatario                 VARCHAR2(150 CHAR) NOT NULL,
    banco_destino                     VARCHAR2(50 CHAR) NOT NULL,
    agencia_destino                   VARCHAR2(10 CHAR) NOT NULL,
    conta_destino                     VARCHAR2(20 CHAR) NOT NULL,
    tipo_conta_destino                VARCHAR2(30 CHAR) NOT NULL,
    chave_pix_destino                 VARCHAR2(150 CHAR),
    tipo_chave_pix_dest               VARCHAR2(20 CHAR),
    descricao                         VARCHAR2(200 CHAR),
    tentativas_execucao               NUMBER(3),
    ultima_atualizacao                DATE NOT NULL,
    CONSTRAINT TRANSFERENCIA_AGENDADA_PK PRIMARY KEY (id_agendamento),
    CONSTRAINT TRANSF_AGENDADA_CONTA_FK FOREIGN KEY (CONTA_MASSPAY_id_conta) REFERENCES CONTA_MASSPAY (id_conta),
    CONSTRAINT TRANSF_AGENDADA_CATEGORIA_FK FOREIGN KEY (CATEGORIA_TRANSACAO_id_categoria) REFERENCES CATEGORIA_TRANSACAO (id_categoria)
);


CREATE SEQUENCE SEQ_USUARIO START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_CATEGORIA_TRANSACAO START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_CONTA_MASSPAY START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_ENDERECO_USUARIO START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_PREFERENCIAS_USUARIO START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_CONTATO_FAVORITO START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_META_FINANCEIRA START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_DISPOSITIVO_CONECTADO START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_CONTA_VINCULADA START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_CARTAO START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_LIMITE_CONTA START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_INVESTIMENTO START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_TRANSACAO START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_TRANSFERENCIA_AGENDADA START WITH 1 INCREMENT BY 1 NOCACHE;

-- b) Ajustes de modelagem
ALTER TABLE CARTAO DROP COLUMN cvv_hash;

ALTER TABLE INVESTIMENTO DROP CONSTRAINT UQ_INVEST_CONTA_NOME;

ALTER TABLE TRANSFERENCIA_AGENDADA MODIFY (data_execucao NULL);


INSERT INTO CATEGORIA_TRANSACAO (id_categoria, nome_categoria, descricao, tipo_movimentacao, ativo, data_cadastro)
VALUES (SEQ_CATEGORIA_TRANSACAO.NEXTVAL, 'Salario', 'Salario mensal', 'RECEITA', 'S', SYSDATE);

INSERT INTO CATEGORIA_TRANSACAO (id_categoria, nome_categoria, descricao, tipo_movimentacao, ativo, data_cadastro)
VALUES (SEQ_CATEGORIA_TRANSACAO.NEXTVAL, 'Freelance', 'Trabalhos extras', 'RECEITA', 'S', SYSDATE);

INSERT INTO CATEGORIA_TRANSACAO (id_categoria, nome_categoria, descricao, tipo_movimentacao, ativo, data_cadastro)
VALUES (SEQ_CATEGORIA_TRANSACAO.NEXTVAL, 'Alimentacao', 'Mercado e restaurantes', 'DESPESA', 'S', SYSDATE);

INSERT INTO CATEGORIA_TRANSACAO (id_categoria, nome_categoria, descricao, tipo_movimentacao, ativo, data_cadastro)
VALUES (SEQ_CATEGORIA_TRANSACAO.NEXTVAL, 'Moradia', 'Aluguel e contas da casa', 'DESPESA', 'S', SYSDATE);

INSERT INTO CATEGORIA_TRANSACAO (id_categoria, nome_categoria, descricao, tipo_movimentacao, ativo, data_cadastro)
VALUES (SEQ_CATEGORIA_TRANSACAO.NEXTVAL, 'Transporte', 'Aplicativos e combustivel', 'DESPESA', 'S', SYSDATE);

INSERT INTO CATEGORIA_TRANSACAO (id_categoria, nome_categoria, descricao, tipo_movimentacao, ativo, data_cadastro)
VALUES (SEQ_CATEGORIA_TRANSACAO.NEXTVAL, 'Lazer', 'Cinema, shows e viagens', 'DESPESA', 'S', SYSDATE);

COMMIT;


SELECT COUNT(*) AS total_tabelas
  FROM user_tables
 WHERE table_name IN ('USUARIO','CATEGORIA_TRANSACAO','CONTA_MASSPAY','ENDERECO_USUARIO','PREFERENCIAS_USUARIO','CONTATO_FAVORITO','META_FINANCEIRA','DISPOSITIVO_CONECTADO','CONTA_VINCULADA','CARTAO','LIMITE_CONTA','INVESTIMENTO','TRANSACAO','TRANSFERENCIA_AGENDADA');

SELECT COUNT(*) AS total_sequences
  FROM user_sequences
 WHERE sequence_name IN ('SEQ_USUARIO','SEQ_CATEGORIA_TRANSACAO','SEQ_CONTA_MASSPAY','SEQ_ENDERECO_USUARIO','SEQ_PREFERENCIAS_USUARIO','SEQ_CONTATO_FAVORITO','SEQ_META_FINANCEIRA','SEQ_DISPOSITIVO_CONECTADO','SEQ_CONTA_VINCULADA','SEQ_CARTAO','SEQ_LIMITE_CONTA','SEQ_INVESTIMENTO','SEQ_TRANSACAO','SEQ_TRANSFERENCIA_AGENDADA');

SELECT id_categoria, nome_categoria, tipo_movimentacao
  FROM CATEGORIA_TRANSACAO
 ORDER BY id_categoria;

SELECT (SELECT COUNT(*) FROM USUARIO)       AS usuarios,
       (SELECT COUNT(*) FROM CONTA_MASSPAY) AS contas,
       (SELECT COUNT(*) FROM TRANSACAO)     AS transacoes,
       (SELECT COUNT(*) FROM INVESTIMENTO)  AS investimentos
  FROM DUAL;