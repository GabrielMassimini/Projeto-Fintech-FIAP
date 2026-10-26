package br.com.fiap.masspay.repository;

import br.com.fiap.masspay.model.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContaRepository extends JpaRepository<Conta, Long> {

    List<Conta> findByUsuarioIdOrderByIdAsc(Long usuarioId);

    boolean existsByUsuarioId(Long usuarioId);

    boolean existsByNumeroConta(String numeroConta);

    boolean existsByNumeroContaAndIdNot(String numeroConta, Long id);
}
