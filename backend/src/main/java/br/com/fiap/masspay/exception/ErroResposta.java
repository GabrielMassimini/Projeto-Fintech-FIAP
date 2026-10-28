package br.com.fiap.masspay.exception;

import java.time.LocalDateTime;
import java.util.Map;

// Corpo JSON devolvido em toda resposta de erro da API.
public class ErroResposta {

    private LocalDateTime dataHora;
    private int status;
    private String mensagem;
    private Map<String, String> campos; // erros de cada campo (só na validação)

    public ErroResposta(int status, String mensagem) {
        this.dataHora = LocalDateTime.now();
        this.status = status;
        this.mensagem = mensagem;
    }

    public ErroResposta(int status, String mensagem, Map<String, String> campos) {
        this(status, mensagem);
        this.campos = campos;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public int getStatus() {
        return status;
    }

    public String getMensagem() {
        return mensagem;
    }

    public Map<String, String> getCampos() {
        return campos;
    }
}
