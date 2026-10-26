package br.com.fiap.masspay.service;

import br.com.fiap.masspay.exception.RecursoNaoEncontradoException;
import br.com.fiap.masspay.exception.RegraNegocioException;
import br.com.fiap.masspay.model.Categoria;
import br.com.fiap.masspay.model.Conta;
import br.com.fiap.masspay.model.Transacao;
import br.com.fiap.masspay.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private ContaService contaService;

    @Autowired
    private CategoriaService categoriaService;

    // @Transactional: a transação e o novo saldo da conta são gravados juntos, ou nenhum dos dois
    @Transactional
    public Transacao salvar(Transacao transacao) {
        if (transacao.getConta().getId() == null || transacao.getCategoria().getId() == null) {
            throw new RegraNegocioException("Informe o id da conta e o id da categoria");
        }
        Conta conta = contaService.buscarPorId(transacao.getConta().getId());
        Categoria categoria = categoriaService.buscarPorId(transacao.getCategoria().getId());

        transacao.setId(null);
        transacao.setConta(conta);
        aplicarCategoria(transacao, categoria);
        if (transacao.getDataTransacao() == null) {
            transacao.setDataTransacao(LocalDate.now());
        }

        // RECEITA soma ao saldo; DESPESA subtrai (e é recusada se faltar saldo)
        contaService.movimentarSaldo(conta, efeitoNoSaldo(transacao));
        transacao.setSaldoApos(conta.getSaldoDisponivel());
        transacao.setStatusTransacao("CONCLUIDA");
        return transacaoRepository.save(transacao);
    }

    public Transacao buscarPorId(Long id) {
        return transacaoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Transação não encontrada"));
    }

    // Filtros opcionais: por conta ou por usuário (todas as contas dele)
    public List<Transacao> listarTodos(Long contaId, Long usuarioId) {
        if (contaId != null) {
            return transacaoRepository.findByContaIdOrderByDataTransacaoDescIdDesc(contaId);
        }
        if (usuarioId != null) {
            return transacaoRepository.findByContaUsuarioIdOrderByDataTransacaoDescIdDesc(usuarioId);
        }
        return transacaoRepository.findAllByOrderByDataTransacaoDescIdDesc();
    }

    // A conta não muda. Se o valor ou a categoria mudarem, o saldo é corrigido pela diferença.
    @Transactional
    public Transacao atualizar(Long id, Transacao dados) {
        Transacao transacao = buscarPorId(id);
        if (dados.getCategoria().getId() == null) {
            throw new RegraNegocioException("Informe o id da categoria");
        }
        Categoria categoria = categoriaService.buscarPorId(dados.getCategoria().getId());

        BigDecimal efeitoAntigo = efeitoNoSaldo(transacao);
        transacao.setValor(dados.getValor());
        aplicarCategoria(transacao, categoria);
        BigDecimal efeitoNovo = efeitoNoSaldo(transacao);
        contaService.movimentarSaldo(transacao.getConta(), efeitoNovo.subtract(efeitoAntigo));

        transacao.setDescricao(dados.getDescricao());
        transacao.setDetalhes(dados.getDetalhes());
        if (dados.getDataTransacao() != null) {
            transacao.setDataTransacao(dados.getDataTransacao());
        }
        transacao.setSaldoApos(transacao.getConta().getSaldoDisponivel());
        return transacaoRepository.save(transacao);
    }

    // Excluir desfaz o efeito no saldo: uma receita apagada sai da conta; uma despesa apagada volta
    @Transactional
    public void excluir(Long id) {
        Transacao transacao = buscarPorId(id);
        contaService.movimentarSaldo(transacao.getConta(), efeitoNoSaldo(transacao).negate());
        transacaoRepository.delete(transacao);
    }

    private void aplicarCategoria(Transacao transacao, Categoria categoria) {
        if (!"S".equals(categoria.getAtivo())) {
            throw new RegraNegocioException("A categoria " + categoria.getNomeCategoria() + " está inativa");
        }
        transacao.setCategoria(categoria);
        transacao.setTipoTransacao(categoria.getTipoMovimentacao());
    }

    private BigDecimal efeitoNoSaldo(Transacao transacao) {
        return "RECEITA".equals(transacao.getTipoTransacao())
                ? transacao.getValor()
                : transacao.getValor().negate();
    }
}
