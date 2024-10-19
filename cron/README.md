# Rodando localmente

## Sem usar o docker

Para rodar o cron na máquina local sem usar o docker basta executar o node informando o arquivo .env com as variáveis ambiente de desenvolvimento.

```sh
node --env-file .env.development.local src/cron/arquivo.mjs
```

Essa alternativa é mais recomendada para testar ou executar algum script em caso de algum problema.

## Rodando no container

Será necessário realizar a build da imagem docker.

```sh
docker image build -t seai-cron -f .
```

E por fim irá ser necessário subir o container.

```sh
docker container run -d seai-cron
```

Lembrando que o os scripts serão executados usando o pacote cron instalado na própria imagem base do docker. Dessa forma basta checar o arquivo contendo as declarações dos crons `register-cron.sh`.
