package br.com.fiap.masspay.controller;

import br.com.fiap.masspay.dto.LoginRequest;
import br.com.fiap.masspay.model.Usuario;
import br.com.fiap.masspay.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    // Devolve o usuário logado (200) ou 401 se o e-mail ou a senha estiverem errados
    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public Usuario login(@RequestBody @Valid LoginRequest login) {
        return usuarioService.autenticar(login.getEmail(), login.getSenha());
    }
}
