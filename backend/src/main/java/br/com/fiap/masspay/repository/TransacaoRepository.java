package br.com.fiap.masspay.repository;

import br.com.fiap.masspay.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    // Listas sempre da mais recente para a mais antiga
    List<Transacao> findAllByOrderByDataTransacaoDescIdDesc();

    List<Transacao> findByContaIdOrderByDataTransacaoDescIdDesc(Long contaId);

    List<Transacao> findByContaUsuarioIdOrderByDataTransacaoDescIdDesc(Long usuarioId);

    boolean existsByContaId(Long contaId);
}
