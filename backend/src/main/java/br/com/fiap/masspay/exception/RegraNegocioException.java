package br.com.fiap.masspay.exception;

// Vira HTTP 400 (Bad Request) no TratadorDeErros. Ex.: saldo insuficiente.
public class RegraNegocioException extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
