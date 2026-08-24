package java;

public class Conta {
    
    private String numeroConta;
    private String agencia;
    private Double saldo;
    private String tipoConta;
    private Usuario usuario;

    public Conta() {
    }

    public Conta(String numeroConta, String agencia, Double saldo, String tipoConta, Usuario usuario) {
        this.numeroConta = numeroConta;
        this.agencia = agencia;
        this.saldo = saldo;
        this.tipoConta = tipoConta;
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

    public Double getSaldo() {
        return saldo;
    }

    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }

    public String getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(String tipoConta) {
        this.tipoConta = tipoConta;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public void depositar(Double valor) {
        System.out.println("Depositando R$ " + valor + " na conta " + numeroConta);
    }

    public void sacar(Double valor) {
        System.out.println("Sacando R$ " + valor + " da conta " + numeroConta);
    }

    public void consultarSaldo() {
        System.out.println("Consultando saldo da conta " + numeroConta + ": R$ " + saldo);
    }
}
