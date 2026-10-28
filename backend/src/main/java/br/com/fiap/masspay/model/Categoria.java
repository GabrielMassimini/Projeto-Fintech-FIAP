package br.com.fiap.masspay.model;

import jakarta.persistence.*;

import java.time.LocalDate;

// Categorias de transação (Salário, Moradia...). São criadas pelo script do banco
// e a API só permite consultá-las.
@Entity
@Table(name = "CATEGORIA_TRANSACAO")
public class Categoria {

    @Id
    @Column(name = "id_categoria")
    private Long id;

    @Column(name = "nome_categoria")
    private String nomeCategoria;

    private String descricao;

    // RECEITA ou DESPESA
    @Column(name = "tipo_movimentacao")
    private String tipoMovimentacao;

    // 'S' ou 'N'
    private String ativo;

    @Column(name = "data_cadastro")
    private LocalDate dataCadastro;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeCategoria() {
        return nomeCategoria;
    }

    public void setNomeCategoria(String nomeCategoria) {
        this.nomeCategoria = nomeCategoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTipoMovimentacao() {
        return tipoMovimentacao;
    }

    public void setTipoMovimentacao(String tipoMovimentacao) {
        this.tipoMovimentacao = tipoMovimentacao;
    }

    public String getAtivo() {
        return ativo;
    }

    public void setAtivo(String ativo) {
        this.ativo = ativo;
    }

    public LocalDate getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDate dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
}
