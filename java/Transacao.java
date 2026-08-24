package java;

public class Transacao {
    
    private Integer idTransacao;
    private String tipo;
    private Double valor;
    private String data;
    private String categoria;
    private String descricao;

    public Transacao() {
    }

    public Transacao(Integer idTransacao, String tipo, Double valor, String data, String categoria, String descricao) {
        this.idTransacao = idTransacao;
        this.tipo = tipo;
        this.valor = valor;
        this.data = data;
        this.categoria = categoria;
        this.descricao = descricao;
    }

    public Integer getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(Integer idTransacao) {
        this.idTransacao = idTransacao;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void executar() {
        System.out.println("Executando transação " + idTransacao + " do tipo " + tipo);
    }

    public void cancelar() {
        System.out.println("Cancelando transação " + idTransacao);
    }

    public void gerarComprovante() {
        System.out.println("Gerando comprovante da transação " + idTransacao);
    }
}
