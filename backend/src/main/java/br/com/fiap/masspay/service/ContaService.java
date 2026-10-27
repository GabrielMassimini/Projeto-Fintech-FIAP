package br.com.fiap.masspay.service;

import br.com.fiap.masspay.exception.ConflitoException;
import br.com.fiap.masspay.exception.RecursoNaoEncontradoException;
import br.com.fiap.masspay.exception.RegraNegocioException;
import br.com.fiap.masspay.model.Conta;
import br.com.fiap.masspay.model.Usuario;
import br.com.fiap.masspay.repository.ContaRepository;
import br.com.fiap.masspay.repository.InvestimentoRepository;
import br.com.fiap.masspay.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
public class ContaService {

    // Formata valores como "R$ 1.234,56" nas mensagens de erro
    private static final NumberFormat MOEDA = NumberFormat.getCurrencyInstance(Locale.of("pt", "BR"));

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private InvestimentoRepository investimentoRepository;

    @Autowired
    private UsuarioService usuarioService;

    public Conta salvar(Conta conta) {
        if (conta.getUsuario().getId() == null) {
            throw new RegraNegocioException("Informe o id do usuário da conta");
        }
        Usuario usuario = usuarioService.buscarPorId(conta.getUsuario().getId());
        if (contaRepository.existsByNumeroConta(conta.getNumeroConta())) {
            throw new ConflitoException("Já existe uma conta com este número");
        }

        BigDecimal saldoInicial = conta.getSaldoDisponivel() == null ? BigDecimal.ZERO : conta.getSaldoDisponivel();
        conta.setId(null);
        conta.setUsuario(usuario);
        conta.setSaldoDisponivel(saldoInicial);
        conta.setSaldoBloqueado(BigDecimal.ZERO);
        conta.setSaldoTotal(saldoInicial);
        conta.setDataAbertura(LocalDate.now());
        if (conta.getStatusConta() == null) {
            conta.setStatusConta("ATIVA");
        }
        return contaRepository.save(conta);
    }

    public Conta buscarPorId(Long id) {
        return contaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Conta não encontrada"));
    }

    // Sem filtro, lista todas; com usuarioId, só as contas daquele usuário
    public List<Conta> listarTodos(Long usuarioId) {
        if (usuarioId != null) {
            return contaRepository.findByUsuarioIdOrderByIdAsc(usuarioId);
        }
        return contaRepository.findAll(Sort.by("id"));
    }

    // O dono e o saldo não mudam por aqui: o saldo só muda por transações e investimentos
    public Conta atualizar(Long id, Conta dados) {
        Conta conta = buscarPorId(id);
        if (contaRepository.existsByNumeroContaAndIdNot(dados.getNumeroConta(), id)) {
            throw new ConflitoException("Já existe uma conta com este número");
        }

        conta.setNumeroConta(dados.getNumeroConta());
        conta.setAgencia(dados.getAgencia());
        conta.setTipoConta(dados.getTipoConta());
        if (dados.getStatusConta() != null) {
            conta.setStatusConta(dados.getStatusConta());
        }
        return contaRepository.save(conta);
    }

    public void excluir(Long id) {
        Conta conta = buscarPorId(id);
        if (transacaoRepository.existsByContaId(id) || investimentoRepository.existsByContaId(id)) {
            throw new ConflitoException("A conta tem transações ou investimentos. Exclua-os antes de excluir a conta");
        }
        contaRepository.delete(conta);
    }

    // Usado por transações e investimentos: valor positivo entra na conta, negativo sai.
    public void movimentarSaldo(Conta conta, BigDecimal valor) {
        if (valor.signum() == 0) {
            return;
        }
        if (!"ATIVA".equals(conta.getStatusConta())) {
            throw new RegraNegocioException("A conta " + conta.getNumeroConta() + " não está ATIVA para movimentar dinheiro");
        }
        BigDecimal novoSaldo = conta.getSaldoDisponivel().add(valor);
        if (novoSaldo.signum() < 0) {
            throw new RegraNegocioException("Saldo insuficiente: a conta " + conta.getNumeroConta()
                    + " tem " + MOEDA.format(conta.getSaldoDisponivel()) + " disponíveis");
        }
        conta.setSaldoDisponivel(novoSaldo);
        conta.setSaldoTotal(novoSaldo.add(conta.getSaldoBloqueado()));
        contaRepository.save(conta);
    }
}
