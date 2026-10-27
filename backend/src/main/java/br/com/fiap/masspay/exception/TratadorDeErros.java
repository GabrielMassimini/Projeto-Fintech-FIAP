package br.com.fiap.masspay.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// Transforma as exceções lançadas pelos services no status HTTP correto.
@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResposta> naoEncontrado(RecursoNaoEncontradoException e) {
        ErroResposta erro = new ErroResposta(404, e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResposta> regraNegocio(RegraNegocioException e) {
        ErroResposta erro = new ErroResposta(400, e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<ErroResposta> conflito(ConflitoException e) {
        ErroResposta erro = new ErroResposta(409, e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
    }

    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<ErroResposta> credenciaisInvalidas(CredenciaisInvalidasException e) {
        ErroResposta erro = new ErroResposta(401, e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
    }

    // Erros das anotações de validação (@NotBlank, @Email etc.), campo por campo
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> validacao(MethodArgumentNotValidException e) {
        Map<String, String> campos = new HashMap<>();
        for (FieldError campo : e.getBindingResult().getFieldErrors()) {
            campos.put(campo.getField(), campo.getDefaultMessage());
        }
        ErroResposta erro = new ErroResposta(400, "Dados inválidos", campos);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }
}
