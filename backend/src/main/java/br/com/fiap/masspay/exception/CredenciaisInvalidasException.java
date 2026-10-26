package br.com.fiap.masspay.exception;

// Vira HTTP 401 (Unauthorized) no TratadorDeErros, quando o login falha.
public class CredenciaisInvalidasException extends RuntimeException {

    public CredenciaisInvalidasException() {
        super("E-mail ou senha inválidos");
    }
}
