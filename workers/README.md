# Executando localmente

## Workers rodando fora do docker (modo de desenvolvimento)

Será necessário criar o arquivo contendo as variáveis ambiente usada para o desenvolviment local. Como padrão é usado o `.env.development.local`. Nesse caso basta copiar as variáveis presente no arquivo `.env.sample` e substituir conforme for necessário.

Quando estiver desenvolvendo locamente, basta subir primeiramente o serviço do **pg-boss** usando o docker compose.
Para isso basta ir no diretório raiz deste projeto (aonde está localizado o docker compose) e subir apenas o serviço do banco de jobs.

```sh
docker compose up jobs -d
```

Feito isso basta apenas rodar os jobs assíncronos localmente, caso as credenciais de acesso ao banco de dados pg-boss estiverem corretas tudo irá funcionar.

```sh
node --env-file .env.development.local src/index.js
```

Ou executar o script equivalente presente no package.json

```sh
npm run start:dev:local
```

## Rodando no container
