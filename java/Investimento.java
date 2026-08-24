package java;

public class Investimento {
    
    private String nomeInvestimento;
    private Double valorInvestido;
    private Double taxaRendimento;
    private String tipoInvestimento;
    private String dataAplicacao;

    public Investimento() {
    }

    public Investimento(String nomeInvestimento, Double valorInvestido, Double taxaRendimento, String tipoInvestimento, String dataAplicacao) {
        this.nomeInvestimento = nomeInvestimento;
        this.valorInvestido = valorInvestido;
        this.taxaRendimento = taxaRendimento;
        this.tipoInvestimento = tipoInvestimento;
        this.dataAplicacao = dataAplicacao;
    }

    public String getNomeInvestimento() {
        return nomeInvestimento;
    }

    public void setNomeInvestimento(String nomeInvestimento) {
        this.nomeInvestimento = nomeInvestimento;
    }

    public Double getValorInvestido() {
        return valorInvestido;
    }

    public void setValorInvestido(Double valorInvestido) {
        this.valorInvestido = valorInvestido;
    }

    public Double getTaxaRendimento() {
        return taxaRendimento;
    }

    public void setTaxaRendimento(Double taxaRendimento) {
        this.taxaRendimento = taxaRendimento;
    }

    public String getTipoInvestimento() {
        return tipoInvestimento;
    }

    public void setTipoInvestimento(String tipoInvestimento) {
        this.tipoInvestimento = tipoInvestimento;
    }

    public String getDataAplicacao() {
        return dataAplicacao;
    }

    public void setDataAplicacao(String dataAplicacao) {
        this.dataAplicacao = dataAplicacao;
    }

    public void aplicar(Double valor) {
        System.out.println("Aplicando R$ " + valor + " no investimento " + nomeInvestimento);
    }

    public void resgatar() {
        System.out.println("Resgatando o investimento " + nomeInvestimento);
    }

    public void calcularRendimento() {
        System.out.println("Calculando rendimento do investimento " + nomeInvestimento);
    }
}
