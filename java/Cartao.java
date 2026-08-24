package java;

public class Cartao {

    private String numeroCartao;
    private String nomeTitular;
    private String validade;
    private Double limite;
    private Double limiteDisponivel;
    private String bandeira;

    public Cartao() {
    }

    public Cartao(String numeroCartao, String nomeTitular, String validade, Double limite, Double limiteDisponivel, String bandeira) {
        this.numeroCartao = numeroCartao;
        this.nomeTitular = nomeTitular;
        this.validade = validade;
        this.limite = limite;
        this.limiteDisponivel = limiteDisponivel;
        this.bandeira = bandeira;
    }

    public String getNumeroCartao() {
        return numeroCartao;
    }

    public void setNumeroCartao(String numeroCartao) {
        this.numeroCartao = numeroCartao;
    }

    public String getNomeTitular() {
        return nomeTitular;
    }

    public void setNomeTitular(String nomeTitular) {
        this.nomeTitular = nomeTitular;
    }

    public String getValidade() {
        return validade;
    }

    public void setValidade(String validade) {
        this.validade = validade;
    }

    public Double getLimite() {
        return limite;
    }

    public void setLimite(Double limite) {
        this.limite = limite;
    }

    public Double getLimiteDisponivel() {
        return limiteDisponivel;
    }

    public void setLimiteDisponivel(Double limiteDisponivel) {
        this.limiteDisponivel = limiteDisponivel;
    }

    public String getBandeira() {
        return bandeira;
    }

    public void setBandeira(String bandeira) {
        this.bandeira = bandeira;
    }

    public void bloquearCartao() {
        System.out.println("Bloqueando o cartão " + numeroCartao);
    }

    public void desbloquearCartao() {
        System.out.println("Desbloqueando o cartão " + numeroCartao);
    }

    public void aumentarLimite(Double valor) {
        System.out.println("Aumentando o limite do cartão " + numeroCartao + " em R$ " + valor);
    }
}