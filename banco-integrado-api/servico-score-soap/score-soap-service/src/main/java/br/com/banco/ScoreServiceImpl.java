package br.com.banco;

import jakarta.jws.WebService;

@WebService(endpointInterface = "br.com.banco.ScoreService")
public class ScoreServiceImpl implements ScoreService {

    @Override
    public int getScore(String idCliente) {
        if (idCliente != null && idCliente.equals("123")) {
            return 750;
        }
        return 450;
    }
}