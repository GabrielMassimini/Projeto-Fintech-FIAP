package br.com.fiap.masspay.repository;

import br.com.fiap.masspay.model.Investimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestimentoRepository extends JpaRepository<Investimento, Long> {

    List<Investimento> findAllByOrderByDataAplicacaoDescIdDesc();

    List<Investimento> findByContaIdOrderByDataAplicacaoDescIdDesc(Long contaId);

    List<Investimento> findByContaUsuarioIdOrderByDataAplicacaoDescIdDesc(Long usuarioId);

    boolean existsByContaId(Long contaId);
}
