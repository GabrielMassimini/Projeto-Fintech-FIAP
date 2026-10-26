package br.com.fiap.masspay.exception;

// Vira HTTP 404 (Not Found) no TratadorDeErros.
public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
