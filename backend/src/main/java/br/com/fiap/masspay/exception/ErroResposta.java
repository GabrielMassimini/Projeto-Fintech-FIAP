package br.com.fiap.masspay.exception;

import java.time.LocalDateTime;
import java.util.Map;

// Corpo JSON devolvido em toda resposta de erro da API.
public record ErroResposta(LocalDateTime dataHora, int status, String mensagem, Map<String, String> campos) {

    public ErroResposta(int status, String mensagem) {
        this(LocalDateTime.now(), status, mensagem, null);
    }

    public ErroResposta(int status, String mensagem, Map<String, String> campos) {
        this(LocalDateTime.now(), status, mensagem, campos);
    }
}
