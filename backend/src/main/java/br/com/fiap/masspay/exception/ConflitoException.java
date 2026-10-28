package br.com.fiap.masspay.exception;

// Vira HTTP 409 (Conflict) no TratadorDeErros. Ex.: e-mail já cadastrado.
public class ConflitoException extends RuntimeException {

    public ConflitoException(String mensagem) {
        super(mensagem);
    }
}
