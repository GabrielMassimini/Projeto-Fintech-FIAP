package br.com.fiap.masspay.repository;

import br.com.fiap.masspay.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByAtivoOrderByNomeCategoriaAsc(String ativo);
}
