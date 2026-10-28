package br.com.fiap.masspay.service;

import br.com.fiap.masspay.exception.ConflitoException;
import br.com.fiap.masspay.exception.CredenciaisInvalidasException;
import br.com.fiap.masspay.exception.RecursoNaoEncontradoException;
import br.com.fiap.masspay.exception.RegraNegocioException;
import br.com.fiap.masspay.model.Usuario;
import br.com.fiap.masspay.repository.ContaRepository;
import br.com.fiap.masspay.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private static final int IDADE_MINIMA = 18;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ContaRepository contaRepository;

    public Usuario salvar(Usuario usuario) {
        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new RegraNegocioException("A senha é obrigatória");
        }
        usuario.setEmail(usuario.getEmail().trim().toLowerCase());
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
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        if (usuarioOptional.isPresent()) {
            return usuarioOptional.get();
        } else {
            throw new RecursoNaoEncontradoException("Usuário não encontrado");
        }
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario atualizar(Long id, Usuario dados) {
        Usuario usuario = buscarPorId(id);
        dados.setEmail(dados.getEmail().trim().toLowerCase());
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
        if (contaRepository.existsByUsuarioId(id)) {
            throw new ConflitoException("O usuário tem contas abertas. Exclua as contas antes de excluir o usuário");
        }
        usuarioRepository.delete(usuario);
    }

    public Usuario autenticar(String email, String senha) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email.trim().toLowerCase());
        if (usuarioOptional.isEmpty()) {
            throw new CredenciaisInvalidasException();
        }

        Usuario usuario = usuarioOptional.get();
        // Senha errada ou usuário inativo: a mesma mensagem, para não dar pistas
        if (!SenhaUtil.confere(senha, usuario.getSenhaHash()) || !usuario.getStatus().equals("ATIVO")) {
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
}
