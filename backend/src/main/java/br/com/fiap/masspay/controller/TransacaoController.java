package br.com.fiap.masspay.controller;

import br.com.fiap.masspay.model.Transacao;
import br.com.fiap.masspay.service.TransacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transacoes")
@CrossOrigin(origins = "http://localhost:5173") // libera o frontend React (Vite)
public class TransacaoController {

    @Autowired
    private TransacaoService transacaoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Transacao salvar(@RequestBody @Valid Transacao transacao) {
        return transacaoService.salvar(transacao);
    }

    // GET /api/transacoes, ?contaId=1 ou ?usuarioId=1
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Transacao> listarTodos(@RequestParam(required = false) Long contaId,
                                       @RequestParam(required = false) Long usuarioId) {
        return transacaoService.listarTodos(contaId, usuarioId);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Transacao buscarPorId(@PathVariable Long id) {
        return transacaoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Transacao atualizar(@PathVariable Long id, @RequestBody @Valid Transacao transacao) {
        return transacaoService.atualizar(id, transacao);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        transacaoService.excluir(id);
    }
}
