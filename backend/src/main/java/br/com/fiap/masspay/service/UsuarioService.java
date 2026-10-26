package br.com.fiap.masspay.service;

import br.com.fiap.masspay.exception.ConflitoException;
import br.com.fiap.masspay.exception.CredenciaisInvalidasException;
import br.com.fiap.masspay.exception.RecursoNaoEncontradoException;
import br.com.fiap.masspay.exception.RegraNegocioException;
import br.com.fiap.masspay.model.Usuario;
import br.com.fiap.masspay.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class UsuarioService {

    private static final int IDADE_MINIMA = 18;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario salvar(Usuario usuario) {
        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new RegraNegocioException("A senha é obrigatória");
        }
        usuario.setEmail(normalizarEmail(usuario.getEmail()));
        validarIdade(usuario.getDataNascimento());
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new ConflitoException("Já existe um usuário com este e-mail");
        }
        if (usuarioRepository.existsByCpf(usuario.getCpf())) {
            throw new ConflitoException("Já existe um usuário com este CPF");
        }

        usuario.setId(null);
        usuario.setSenhaHash(SenhaUtil.gerarHash(usuario.getSenha()));
        usuario.setDataCadastro(LocalDate.now());
        if (usuario.getStatus() == null) {
            usuario.setStatus("ATIVO");
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario atualizar(Long id, Usuario dados) {
        Usuario usuario = buscarPorId(id);
        dados.setEmail(normalizarEmail(dados.getEmail()));
        validarIdade(dados.getDataNascimento());
        if (usuarioRepository.existsByEmailAndIdNot(dados.getEmail(), id)) {
            throw new ConflitoException("Já existe um usuário com este e-mail");
        }
        if (usuarioRepository.existsByCpfAndIdNot(dados.getCpf(), id)) {
            throw new ConflitoException("Já existe um usuário com este CPF");
        }

        usuario.setNomeCompleto(dados.getNomeCompleto());
        usuario.setCpf(dados.getCpf());
        usuario.setDataNascimento(dados.getDataNascimento());
        usuario.setEmail(dados.getEmail());
        usuario.setTelefone(dados.getTelefone());
        if (dados.getStatus() != null) {
            usuario.setStatus(dados.getStatus());
        }
        // A senha só muda se uma nova for enviada
        if (dados.getSenha() != null && !dados.getSenha().isBlank()) {
            usuario.setSenhaHash(SenhaUtil.gerarHash(dados.getSenha()));
        }
        return usuarioRepository.save(usuario);
    }

    public void excluir(Long id) {
        Usuario usuario = buscarPorId(id);
        usuarioRepository.delete(usuario);
    }

    public Usuario autenticar(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(normalizarEmail(email))
                .orElseThrow(CredenciaisInvalidasException::new);
        if (!SenhaUtil.confere(senha, usuario.getSenhaHash()) || !"ATIVO".equals(usuario.getStatus())) {
            throw new CredenciaisInvalidasException();
        }
        return usuario;
    }

    private void validarIdade(LocalDate dataNascimento) {
        int idade = Period.between(dataNascimento, LocalDate.now()).getYears();
        if (idade < IDADE_MINIMA) {
            throw new RegraNegocioException("O usuário precisa ter pelo menos " + IDADE_MINIMA + " anos");
        }
    }

    private String normalizarEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
