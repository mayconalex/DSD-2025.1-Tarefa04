import zeep

WSDL_URL = 'https://verbose-meme-gr7w774vqjpfg55-8080.app.github.dev/score-service?wsdl' 

print(f"Tentando conectar ao WSDL em: {WSDL_URL}")

try:
    client = zeep.Client(wsdl=WSDL_URL)
    print("Conexão com o WSDL bem-sucedida!")

    id_cliente_valido = "123"
    id_cliente_invalido = "999"

    print(f"\nConsultando score para o cliente ID: {id_cliente_valido}...")
    resultado_valido = client.service.getScore(arg0=id_cliente_valido)
    print(f"Resultado -> Score: {resultado_valido}")

    print(f"\nConsultando score para o cliente ID: {id_cliente_invalido}...")
    resultado_invalido = client.service.getScore(arg0=id_cliente_invalido)
    print(f"Resultado -> Score: {resultado_invalido}")

except Exception as e:
    print("\n--- OCORREU UM ERRO ---")
    print(f"Não foi possível conectar ou chamar o serviço SOAP.")
    print(f"Detalhes do erro: {e}")