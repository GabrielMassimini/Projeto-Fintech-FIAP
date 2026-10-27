package br.com.fiap.masspay.service;

import br.com.fiap.masspay.exception.RecursoNaoEncontradoException;
import br.com.fiap.masspay.model.Categoria;
import br.com.fiap.masspay.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarAtivas() {
        return categoriaRepository.findByAtivoOrderByNomeCategoriaAsc("S");
    }

    public Categoria buscarPorId(Long id) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        if (categoriaOptional.isPresent()) {
            return categoriaOptional.get();
        } else {
            throw new RecursoNaoEncontradoException("Categoria não encontrada");
        }
    }
}
