package java;

public class Emprestimo {
    
    private Double valorSolicitado;
    private Integer numeroParcelas;
    private Double taxaJuros;
    private Double valorParcela;
    private String status;

    public Emprestimo() {
    }

    public Emprestimo(Double valorSolicitado, Integer numeroParcelas, Double taxaJuros, Double valorParcela, String status) {
        this.valorSolicitado = valorSolicitado;
        this.numeroParcelas = numeroParcelas;
        this.taxaJuros = taxaJuros;
        this.valorParcela = valorParcela;
        this.status = status;
    }

    public Double getValorSolicitado() {
        return valorSolicitado;
    }

    public void setValorSolicitado(Double valorSolicitado) {
        this.valorSolicitado = valorSolicitado;
    }

    public Integer getNumeroParcelas() {
        return numeroParcelas;
    }

    public void setNumeroParcelas(Integer numeroParcelas) {
        this.numeroParcelas = numeroParcelas;
    }

    public Double getTaxaJuros() {
        return taxaJuros;
    }

    public void setTaxaJuros(Double taxaJuros) {
        this.taxaJuros = taxaJuros;
    }

    public Double getValorParcela() {
        return valorParcela;
    }

    public void setValorParcela(Double valorParcela) {
        this.valorParcela = valorParcela;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void simular() {
        System.out.println("Simulando empréstimo de R$ " + valorSolicitado + " em " + numeroParcelas + " parcelas");
    }

    public void contratar() {
        System.out.println("Contratando empréstimo de R$ " + valorSolicitado);
    }

    public void quitar() {
        System.out.println("Quitando empréstimo de R$ " + valorSolicitado);
    }
}
