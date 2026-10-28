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
import java.util.Optional;

@Service
public class InvestimentoService {

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
        investimento.setStatusInvestimento("ATIVO");
        investimento.setDataCadastro(LocalDate.now());

        contaService.movimentarSaldo(conta, investimento.getValorAplicado().negate());
        return investimentoRepository.save(investimento);
    }

    public Investimento buscarPorId(Long id) {
        Optional<Investimento> investimentoOptional = investimentoRepository.findById(id);
        if (investimentoOptional.isPresent()) {
            return investimentoOptional.get();
        } else {
            throw new RecursoNaoEncontradoException("Investimento não encontrado");
        }
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

    @Transactional
    public Investimento atualizar(Long id, Investimento dados) {
        Investimento investimento = buscarPorId(id);
        Conta conta = investimento.getConta();

        String statusAtual = investimento.getStatusInvestimento();
        String novoStatus = dados.getStatusInvestimento();
        if (novoStatus == null) {
            novoStatus = statusAtual;
        }

        BigDecimal rendimentoAtual = investimento.getRendimento();
        if (rendimentoAtual == null) {
            rendimentoAtual = BigDecimal.ZERO;
        }
        BigDecimal novoRendimento = dados.getRendimento();
        if (novoRendimento == null) {
            novoRendimento = BigDecimal.ZERO;
        }

        if (statusAtual.equals("ATIVO")) {
            // 1. Se o valor aplicado mudou, a diferença sai da conta (ou volta para ela)
            BigDecimal diferenca = dados.getValorAplicado().subtract(investimento.getValorAplicado());
            contaService.movimentarSaldo(conta, diferenca.negate());

            // 2. Se está sendo resgatado ou encerrado, o valor aplicado + rendimento voltam para a conta
            if (!novoStatus.equals("ATIVO")) {
                contaService.movimentarSaldo(conta, dados.getValorAplicado().add(novoRendimento));
            }
        } else {
            // Já foi resgatado: o dinheiro já voltou para a conta, então valor e rendimento não mudam mais
            if (novoStatus.equals("ATIVO")) {
                throw new RegraNegocioException("Um investimento resgatado ou encerrado não pode voltar a ficar ATIVO");
            }
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
        if (investimento.getStatusInvestimento().equals("ATIVO")) {
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
