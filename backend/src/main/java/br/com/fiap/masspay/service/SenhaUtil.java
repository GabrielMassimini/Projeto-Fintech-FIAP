package br.com.fiap.masspay.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

// Gera o hash SHA-256 das senhas com a classe MessageDigest, que já vem no Java.
public final class SenhaUtil {

    private SenhaUtil() {
    }

    public static String gerarHash(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(senha.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 não está disponível nesta JVM", e);
        }
    }

    public static boolean confere(String senha, String hashGravado) {
        return gerarHash(senha).equals(hashGravado);
    }
}
