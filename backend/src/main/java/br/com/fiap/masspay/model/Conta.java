package br.com.fiap.masspay.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "CONTA_MASSPAY")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_CONTA_MASSPAY")
    @SequenceGenerator(name = "SEQ_CONTA_MASSPAY", sequenceName = "SEQ_CONTA_MASSPAY", allocationSize = 1)
    @Column(name = "id_conta")
    private Long id;

    // No JSON basta enviar o id: "usuario": { "id": 1 }
    @NotNull(message = "O usuário da conta é obrigatório")
    @ManyToOne
    @JoinColumn(name = "USUARIO_id_usuario")
    private Usuario usuario;

    @NotBlank(message = "O número da conta é obrigatório")
    @Pattern(regexp = "[0-9-]{1,10}", message = "O número da conta deve ter até 10 caracteres, só números e traço")
    @Column(name = "numero_conta")
    private String numeroConta;

    @NotBlank(message = "A agência é obrigatória")
    @Pattern(regexp = "\\d{1,5}", message = "A agência deve ter até 5 números")
    private String agencia;

    @NotBlank(message = "O tipo da conta é obrigatório")
    @Pattern(regexp = "CORRENTE|POUPANCA", message = "O tipo da conta deve ser CORRENTE ou POUPANCA")
    @Column(name = "tipo_conta")
    private String tipoConta;

    // Informado só na abertura (depósito inicial). Depois, só muda por transações e investimentos.
    @PositiveOrZero(message = "O saldo inicial não pode ser negativo")
    @Digits(integer = 13, fraction = 2, message = "Valor inválido")
    @Column(name = "saldo_disponivel")
    private BigDecimal saldoDisponivel;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "saldo_bloqueado")
    private BigDecimal saldoBloqueado;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "saldo_total")
    private BigDecimal saldoTotal;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "data_abertura")
    private LocalDate dataAbertura;

    @Pattern(regexp = "ATIVA|BLOQUEADA|ENCERRADA", message = "O status deve ser ATIVA, BLOQUEADA ou ENCERRADA")
    @Column(name = "status_conta")
    private String statusConta;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getNumeroConta() {
        return numeroConta;
    }

    public void setNumeroConta(String numeroConta) {
        this.numeroConta = numeroConta;
    }

    public String getAgencia() {
        return agencia;
    }

    public void setAgencia(String agencia) {
        this.agencia = agencia;
    }

    public String getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(String tipoConta) {
        this.tipoConta = tipoConta;
    }

    public BigDecimal getSaldoDisponivel() {
        return saldoDisponivel;
    }

    public void setSaldoDisponivel(BigDecimal saldoDisponivel) {
        this.saldoDisponivel = saldoDisponivel;
    }

    public BigDecimal getSaldoBloqueado() {
        return saldoBloqueado;
    }

    public void setSaldoBloqueado(BigDecimal saldoBloqueado) {
        this.saldoBloqueado = saldoBloqueado;
    }

    public BigDecimal getSaldoTotal() {
        return saldoTotal;
    }

    public void setSaldoTotal(BigDecimal saldoTotal) {
        this.saldoTotal = saldoTotal;
    }

    public LocalDate getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDate dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public String getStatusConta() {
        return statusConta;
    }

    public void setStatusConta(String statusConta) {
        this.statusConta = statusConta;
    }
}
