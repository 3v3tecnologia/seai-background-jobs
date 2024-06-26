# Seai asynchronous jobs

É necessário criar a network denominada **jobs** pois esse serviço irá se comunicar com o banco de dados do seai, possibilitando os workers realizar leituras e escritas ao banco por meio da rede compartilhada.

```shell
    docker network create jobs
```

> É necessário sempre checar se a rede **jobs** está atribuída do docker compose do serviço de banco de dados do SEAI.

## Configuração das variáveis ambiente

É necessário ir ao diretório **src/background-jobs** e baseado no arquivo **.env.sample** atribuir as configurações necessárias.

> Note que há variáveis que serão definidas somente para testes, logo não são necessárias para o modo de produção.

```sh
    # NODE.js mode
    NODE_ENV= # "development" or "test" or "production"

    ########## ONLY TEST ##############

    # seai test database config
    DATABASE_PORT_TEST=
    DATABASE_HOST_TEST=
    DATABASE_USER_TEST=
    DATABASE_PASSWORD_TEST=

    # pg-boss database config
    DB_JOB_PORT_TEST=
    DB_JOB_HOST_TEST=
    DB_JOB_USER_NAME_TEST=
    DB_JOB_PASSWORD_TEST=
    DB_JOB_NAME_TEST=

    # seai logs database config
    DB_LOGS_PORT_TEST=
    DB_LOGS_HOST_TEST=
    DB_LOGS_USER_NAME_TEST=
    DB_LOGS_PASSWORD_TEST=

```


## Secrets com as credenciais do banco

Na pasta raiz, onde é definido o **docker-compose.yml**, será necessário criar um arquivo de texto contendo somente a senha de acesso ao banco de _jobs_.

```yml
secrets:
  db-password:
    file: password.txt # exemplo de um possível arquivo com senha
```

No arquivo criado apenas informe a senha, como mostrado abaixo.

```sh
# password.txt
minhasenha
```

## Executando o projeto

Execute o docker compose no diretório raiz do projeto

```shell
    docker compose up -d
```
