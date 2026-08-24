package java;

public class Usuario {
    
    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private String telefone;

    public Usuario() {
    }

    public Usuario(String nome, String cpf, String email, String senha, String telefone) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public void cadastrar() {
        System.out.println("Cadastrando usuário: " + nome);
    }

    public void atualizarDados() {
        System.out.println("Atualizando dados do usuário: " + nome);
    }

    public void validarCpf() {
        System.out.println("Validando CPF do usuário: " + cpf);
    }
}
