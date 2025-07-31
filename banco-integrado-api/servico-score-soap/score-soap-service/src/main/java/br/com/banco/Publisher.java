package br.com.banco;

import jakarta.xml.ws.Endpoint;

public class Publisher {
    public static void main(String[] args) {
        String url = "http://0.0.0.0:8080/score-service";
        Endpoint.publish(url, new ScoreServiceImpl());
        System.out.println("Serviço SOAP de Score rodando em: " + url);
        System.out.println("Acesse o WSDL em: http://localhost:8080/score-service?wsdl");
    }
}