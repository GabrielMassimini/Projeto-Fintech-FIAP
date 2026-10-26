package br.com.fiap.masspay.controller;

import br.com.fiap.masspay.model.Investimento;
import br.com.fiap.masspay.service.InvestimentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investimentos")
public class InvestimentoController {

    @Autowired
    private InvestimentoService investimentoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Investimento salvar(@RequestBody @Valid Investimento investimento) {
        return investimentoService.salvar(investimento);
    }

    // GET /api/investimentos, ?contaId=1 ou ?usuarioId=1
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Investimento> listarTodos(@RequestParam(required = false) Long contaId,
                                          @RequestParam(required = false) Long usuarioId) {
        return investimentoService.listarTodos(contaId, usuarioId);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Investimento buscarPorId(@PathVariable Long id) {
        return investimentoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Investimento atualizar(@PathVariable Long id, @RequestBody @Valid Investimento investimento) {
        return investimentoService.atualizar(id, investimento);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        investimentoService.excluir(id);
    }
}
