package br.com.fiap.masspay.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

// Gera o hash SHA-256 das senhas com a classe MessageDigest, que já vem no Java.
public class SenhaUtil {

    public static String gerarHash(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(senha.getBytes(StandardCharsets.UTF_8));

            // Converte cada byte para dois caracteres em hexadecimal
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Não foi possível gerar o hash da senha", e);
        }
    }

    public static boolean confere(String senha, String hashGravado) {
        return gerarHash(senha).equals(hashGravado);
    }
}
