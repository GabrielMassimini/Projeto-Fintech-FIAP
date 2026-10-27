package br.com.fiap.masspay.controller;

import br.com.fiap.masspay.model.Conta;
import br.com.fiap.masspay.service.ContaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contas")
@CrossOrigin(origins = "http://localhost:5173") // libera o frontend React (Vite)
public class ContaController {

    @Autowired
    private ContaService contaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Conta salvar(@RequestBody @Valid Conta conta) {
        return contaService.salvar(conta);
    }

    // GET /api/contas ou GET /api/contas?usuarioId=1
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Conta> listarTodos(@RequestParam(required = false) Long usuarioId) {
        return contaService.listarTodos(usuarioId);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Conta buscarPorId(@PathVariable Long id) {
        return contaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Conta atualizar(@PathVariable Long id, @RequestBody @Valid Conta conta) {
        return contaService.atualizar(id, conta);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        contaService.excluir(id);
    }
}
