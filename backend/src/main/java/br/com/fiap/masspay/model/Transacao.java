package br.com.fiap.masspay.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "TRANSACAO")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_TRANSACAO")
    @SequenceGenerator(name = "SEQ_TRANSACAO", sequenceName = "SEQ_TRANSACAO", allocationSize = 1)
    @Column(name = "id_transacao")
    private Long id;

    // No JSON basta enviar o id: "conta": { "id": 1 }
    @NotNull(message = "A conta é obrigatória")
    @ManyToOne
    @JoinColumn(name = "CONTA_MASSPAY_id_conta")
    private Conta conta;

    // No JSON basta enviar o id: "categoria": { "id": 3 }
    @NotNull(message = "A categoria é obrigatória")
    @ManyToOne
    @JoinColumn(name = "CATEGORIA_TRANSACAO_id_categoria")
    private Categoria categoria;

    @NotBlank(message = "A descrição é obrigatória")
    @Size(max = 200, message = "A descrição pode ter no máximo 200 caracteres")
    private String descricao;

    // RECEITA ou DESPESA: vem da categoria escolhida
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "tipo_transacao")
    private String tipoTransacao;

    @NotNull(message = "O valor é obrigatório")
    @Positive(message = "O valor deve ser maior que zero")
    @Digits(integer = 13, fraction = 2, message = "Valor inválido")
    private BigDecimal valor;

    @PastOrPresent(message = "A data da transação não pode estar no futuro")
    @Column(name = "data_transacao")
    private LocalDate dataTransacao;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "status_transacao")
    private String statusTransacao;

    // Saldo da conta logo depois deste lançamento
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "saldo_apos")
    private BigDecimal saldoApos;

    @Size(max = 4000, message = "Os detalhes podem ter no máximo 4000 caracteres")
    private String detalhes;

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

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTipoTransacao() {
        return tipoTransacao;
    }

    public void setTipoTransacao(String tipoTransacao) {
        this.tipoTransacao = tipoTransacao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDate getDataTransacao() {
        return dataTransacao;
    }

    public void setDataTransacao(LocalDate dataTransacao) {
        this.dataTransacao = dataTransacao;
    }

    public String getStatusTransacao() {
        return statusTransacao;
    }

    public void setStatusTransacao(String statusTransacao) {
        this.statusTransacao = statusTransacao;
    }

    public BigDecimal getSaldoApos() {
        return saldoApos;
    }

    public void setSaldoApos(BigDecimal saldoApos) {
        this.saldoApos = saldoApos;
    }

    public String getDetalhes() {
        return detalhes;
    }

    public void setDetalhes(String detalhes) {
        this.detalhes = detalhes;
    }
}
