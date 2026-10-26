package br.com.fiap.masspay.service;

import br.com.fiap.masspay.exception.RecursoNaoEncontradoException;
import br.com.fiap.masspay.exception.RegraNegocioException;
import br.com.fiap.masspay.model.Conta;
import br.com.fiap.masspay.model.Investimento;
import br.com.fiap.masspay.repository.InvestimentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class InvestimentoService {

    private static final String ATIVO = "ATIVO";

    @Autowired
    private InvestimentoRepository investimentoRepository;

    @Autowired
    private ContaService contaService;

    // Aplicar tira o valor do saldo disponível da conta (recusado se faltar saldo)
    @Transactional
    public Investimento salvar(Investimento investimento) {
        if (investimento.getConta().getId() == null) {
            throw new RegraNegocioException("Informe o id da conta");
        }
        Conta conta = contaService.buscarPorId(investimento.getConta().getId());

        investimento.setId(null);
        investimento.setConta(conta);
        if (investimento.getDataAplicacao() == null) {
            investimento.setDataAplicacao(LocalDate.now());
        }
        validarDatas(investimento);
        investimento.setStatusInvestimento(ATIVO);
        investimento.setDataCadastro(LocalDate.now());

        contaService.movimentarSaldo(conta, investimento.getValorAplicado().negate());
        return investimentoRepository.save(investimento);
    }

    public Investimento buscarPorId(Long id) {
        return investimentoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Investimento não encontrado"));
    }

    // Filtros opcionais: por conta ou por usuário (todas as contas dele)
    public List<Investimento> listarTodos(Long contaId, Long usuarioId) {
        if (contaId != null) {
            return investimentoRepository.findByContaIdOrderByDataAplicacaoDescIdDesc(contaId);
        }
        if (usuarioId != null) {
            return investimentoRepository.findByContaUsuarioIdOrderByDataAplicacaoDescIdDesc(usuarioId);
        }
        return investimentoRepository.findAllByOrderByDataAplicacaoDescIdDesc();
    }

    /*
     * Enquanto o investimento está ATIVO:
     *  - mudar o valor aplicado debita (ou devolve) a diferença na conta;
     *  - mudar o status para RESGATADO ou ENCERRADO devolve valor + rendimento para a conta.
     * Depois de resgatado ou encerrado, valor e rendimento ficam fixos e ele não volta a ser ATIVO.
     */
    @Transactional
    public Investimento atualizar(Long id, Investimento dados) {
        Investimento investimento = buscarPorId(id);
        Conta conta = investimento.getConta();
        String novoStatus = dados.getStatusInvestimento() == null
                ? investimento.getStatusInvestimento()
                : dados.getStatusInvestimento();
        BigDecimal novoRendimento = dados.getRendimento() == null ? BigDecimal.ZERO : dados.getRendimento();

        if (ATIVO.equals(investimento.getStatusInvestimento())) {
            BigDecimal movimento = investimento.getValorAplicado().subtract(dados.getValorAplicado());
            if (!ATIVO.equals(novoStatus)) {
                movimento = movimento.add(dados.getValorAplicado()).add(novoRendimento);
            }
            contaService.movimentarSaldo(conta, movimento);
        } else {
            if (ATIVO.equals(novoStatus)) {
                throw new RegraNegocioException("Um investimento resgatado ou encerrado não pode voltar a ficar ATIVO");
            }
            BigDecimal rendimentoAtual = investimento.getRendimento() == null ? BigDecimal.ZERO : investimento.getRendimento();
            if (dados.getValorAplicado().compareTo(investimento.getValorAplicado()) != 0
                    || novoRendimento.compareTo(rendimentoAtual) != 0) {
                throw new RegraNegocioException("O valor e o rendimento de um investimento resgatado não podem mudar");
            }
        }

        investimento.setTipoInvestimento(dados.getTipoInvestimento());
        investimento.setNomeInvestimento(dados.getNomeInvestimento());
        investimento.setValorAplicado(dados.getValorAplicado());
        investimento.setRendimento(dados.getRendimento());
        investimento.setPercentualRendimento(dados.getPercentualRendimento());
        if (dados.getDataAplicacao() != null) {
            investimento.setDataAplicacao(dados.getDataAplicacao());
        }
        investimento.setDataVencimento(dados.getDataVencimento());
        investimento.setLiquidez(dados.getLiquidez());
        investimento.setStatusInvestimento(novoStatus);
        validarDatas(investimento);
        return investimentoRepository.save(investimento);
    }

    // Excluir um investimento ATIVO cancela a aplicação e devolve o valor para a conta
    @Transactional
    public void excluir(Long id) {
        Investimento investimento = buscarPorId(id);
        if (ATIVO.equals(investimento.getStatusInvestimento())) {
            contaService.movimentarSaldo(investimento.getConta(), investimento.getValorAplicado());
        }
        investimentoRepository.delete(investimento);
    }

    private void validarDatas(Investimento investimento) {
        if (investimento.getDataVencimento() != null
                && investimento.getDataVencimento().isBefore(investimento.getDataAplicacao())) {
            throw new RegraNegocioException("A data de vencimento não pode ser antes da data de aplicação");
        }
    }
}
