package br.com.fiap.masspay.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Dados que a tela de login envia para POST /api/auth/login.
public record LoginRequest(
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        String senha) {
}
