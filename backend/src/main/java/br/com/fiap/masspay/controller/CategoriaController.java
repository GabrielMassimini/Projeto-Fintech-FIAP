package br.com.fiap.masspay.controller;

import br.com.fiap.masspay.model.Categoria;
import br.com.fiap.masspay.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Só consulta: usada pelo frontend para montar a lista de categorias da transação
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Categoria> listarAtivas() {
        return categoriaService.listarAtivas();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria buscarPorId(@PathVariable Long id) {
        return categoriaService.buscarPorId(id);
    }
}
