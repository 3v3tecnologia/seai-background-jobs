# Instalar cron

Será necessário acessar a pasta do cron no repositório e dentro dela executar os passos descritos abaixo.

### 1 - Criar e ajustar variáveis ambiente do arquivo .env

Nesse arquivo irá contecer as configurações necessárias para os scripts poder executar.

```bash
# Chave de acesso a API do seai
ACCESS_KEY="chave da API"

# Endpoint para buscar notícias
NEWSLETTER_API_ADDR="https://url_da_api/api/v1/news"

# Endpoint para buscar equipamentos
EQUIPMENTS_API_ADDR="http://url_da_api/api/v2/equipments"

# Endpoint para buscar relatórios de irrigação
IRRIGATION_API_ADDR="http://url_da_api/api/v2/management/irrigation_crops"

# Credenciais do FTP da funceme
FUNCEME_FTP_HOST="Host do FTP da funceme"
FUNCEME_FTP_USER="Usuario do FTP da funceme"
FUNCEME_FTP_PASSWORD="Senha do FTP da funceme"

# URL de conexão ao serviço de queue
ASYNC_JOB_URL="postgresql://USUARIO:SENHA@HOST:PORTA/BANCO_DE_DADOS"
```

### 2 - Dar permissões de execução para o script register-cron.sh

Esse arquivo irá ser enviado para o container e irá registrar no **crontab** todos os crons que irão serem executados.

```bash
chmod +x register-cron.sh
```

### 3 - Subir o serviço

### Método 1 - Docker compose

Usando o docker-compose.yml irá executar o serviço de cron isoladamente na máquina.

```bash
docker compose up --build -d
```

### Método 2 - Sem usar Docker compose

Antes de executar o container será necessário verificar se já possui a imagem e o container do serviço instalados, se já possuir então será necessário remover ambos.

```bash
# Deletar o container já em execução
docker container rm -f cron

# Execute o comando abaixo e verifique se o container cron-service não está mais na lista
docker container ls

# Deletar a imagem antiga do cron
docker image rm cron

# Execute o comando abaixo e cheque se a imagem cron de fato não está na lista
docker images
```

Subindo o processo

```bash
# Build da imagem do cron
docker image build -t cron .

# Subir o serviço do cron
docker container run -d --network host --name cron-service cron
```

# Instalar workers

Será necessário acessar a pasta que ficam os workers no repositório e dentro dela executar os passos descritos abaixo.

### 1 - Criar e ajustar arquivo .env

```bash
# Credenciais do email
#Porta do serviço de emails
MAIL_PORT=
MAIL_HOST="Endereço do host de mail"
MAIL_PASSWORD="Senha do serviço de email (SMTP)"
MAIL_USERNAME="Usuário do serviço de email (SMTP)"

# Remetente das mensagens
EMAIL_SENDER="test@email.com"

# Chave de acesso a API do seai
ACCESS_KEY="3540abaccb034d60b217b8476987a05f"

# Api URL's
NEWSLETTER_API_ADDR="http://url_da_api/api/v1/news" #Adicionar o endereço da API
IRRIGATION_API_ADDR="http://url_da_api/api/v2/management/irrigation_crops"  #Adicionar o endereço da API

# Redirection links
SEAI_SITE="http://url_do_site.br/#" # Adicionar o endereço do site do governo
SEAI_IRRIGANT_SITE="http://url_do_site/#" # Adicionar o endereço do site do irrigante

# Email contacts
SUPPORT_PHONE="12345" # Telefone do suporte
SUPPORT_WEBSITE="https://url_do_site" # Adicionar o endereço do site de contato com suporte
SUPPORT_EMAIL="test@gmail.com" # Email do suporte

# URL de conexão ao serviço de queue
ASYNC_JOB_URL="postgresql://USUARIO:SENHA@HOST:PORTA/BANCO_DE_DADOS"
```

### 2 - Subir o serviço

### Método 1 - Usando docker compose

Nesse caso irá subir tanto o container do serviço de gerenciamento de tarefas assíncronas como também os workers que irão serem executados em segundo plano.

```bash
docker compose up --build -d
```

### Método 2 - Não usando docker compose

Será necessário primeiro subir o serviço de gerenciamento de tarefas assíncronas primeiro. No caso foi escolhido usar o docker compose só para subir facilmente o banco de dados, mas para a aplicação funcionar só precisa de um serviço para registrar e ler eventos que serão processados em segundo plano.

```bash
# Subir o banco que irá armazenar as tarefas assíncronas (por docker compose ou se for necessário criar um banco do zero será necessário configurar manualmente)
docker compose up jobs_database -d
```

Gerar a build da imagem e executar o container.

```bash
# Fazer o build da imagem
docker image build -t workers .

# Subir
docker container run -d --network host --name workers-service workers
```
