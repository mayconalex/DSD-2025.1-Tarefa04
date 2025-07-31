package br.com.banco;

import jakarta.jws.WebMethod;
import jakarta.jws.WebService;

@WebService
public interface ScoreService {
    @WebMethod
    int getScore(String idCliente);
}