package br.com.fiap.masspay.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "INVESTIMENTO")
public class Investimento {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_INVESTIMENTO")
    @SequenceGenerator(name = "SEQ_INVESTIMENTO", sequenceName = "SEQ_INVESTIMENTO", allocationSize = 1)
    @Column(name = "id_investimento")
    private Long id;

    // No JSON basta enviar o id: "conta": { "id": 1 }
    @NotNull(message = "A conta é obrigatória")
    @ManyToOne
    @JoinColumn(name = "id_conta")
    private Conta conta;

    @NotBlank(message = "O tipo do investimento é obrigatório")
    @Pattern(regexp = "CDB|CDI|TESOURO|POUPANCA|ACOES|FUNDO",
            message = "O tipo deve ser CDB, CDI, TESOURO, POUPANCA, ACOES ou FUNDO")
    @Column(name = "tipo_investimento")
    private String tipoInvestimento;

    @NotBlank(message = "O nome do investimento é obrigatório")
    @Size(max = 100, message = "O nome pode ter no máximo 100 caracteres")
    @Column(name = "nome_investimento")
    private String nomeInvestimento;

    @NotNull(message = "O valor aplicado é obrigatório")
    @Positive(message = "O valor aplicado deve ser maior que zero")
    @Digits(integer = 13, fraction = 2, message = "Valor inválido")
    @Column(name = "valor_aplicado")
    private BigDecimal valorAplicado;

    @PositiveOrZero(message = "O rendimento não pode ser negativo")
    @Digits(integer = 13, fraction = 2, message = "Valor inválido")
    private BigDecimal rendimento;

    @PositiveOrZero(message = "O percentual não pode ser negativo")
    @Digits(integer = 3, fraction = 2, message = "O percentual deve ter até 3 dígitos e 2 casas decimais")
    @Column(name = "percentual_rendimento")
    private BigDecimal percentualRendimento;

    @PastOrPresent(message = "A data de aplicação não pode estar no futuro")
    @Column(name = "data_aplicacao")
    private LocalDate dataAplicacao;

    @Column(name = "data_vencimento")
    private LocalDate dataVencimento;

    @Pattern(regexp = "DIARIA|VENCIMENTO|IMEDIATA", message = "A liquidez deve ser DIARIA, VENCIMENTO ou IMEDIATA")
    private String liquidez;

    @Pattern(regexp = "ATIVO|RESGATADO|ENCERRADO", message = "O status deve ser ATIVO, RESGATADO ou ENCERRADO")
    @Column(name = "status_investimento")
    private String statusInvestimento;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "data_cadastro")
    private LocalDate dataCadastro;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public String getTipoInvestimento() {
        return tipoInvestimento;
    }

    public void setTipoInvestimento(String tipoInvestimento) {
        this.tipoInvestimento = tipoInvestimento;
    }

    public String getNomeInvestimento() {
        return nomeInvestimento;
    }

    public void setNomeInvestimento(String nomeInvestimento) {
        this.nomeInvestimento = nomeInvestimento;
    }

    public BigDecimal getValorAplicado() {
        return valorAplicado;
    }

    public void setValorAplicado(BigDecimal valorAplicado) {
        this.valorAplicado = valorAplicado;
    }

    public BigDecimal getRendimento() {
        return rendimento;
    }

    public void setRendimento(BigDecimal rendimento) {
        this.rendimento = rendimento;
    }

    public BigDecimal getPercentualRendimento() {
        return percentualRendimento;
    }

    public void setPercentualRendimento(BigDecimal percentualRendimento) {
        this.percentualRendimento = percentualRendimento;
    }

    public LocalDate getDataAplicacao() {
        return dataAplicacao;
    }

    public void setDataAplicacao(LocalDate dataAplicacao) {
        this.dataAplicacao = dataAplicacao;
    }

    public LocalDate getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDate dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public String getLiquidez() {
        return liquidez;
    }

    public void setLiquidez(String liquidez) {
        this.liquidez = liquidez;
    }

    public String getStatusInvestimento() {
        return statusInvestimento;
    }

    public void setStatusInvestimento(String statusInvestimento) {
        this.statusInvestimento = statusInvestimento;
    }

    public LocalDate getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDate dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
}
