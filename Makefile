SQS_ENDPOINT := http://localhost:4566
PARAM_DEFAULT := 000000000000 # path do localstack

.DEFAULT_GOAL := help

help: ## Ajuda
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "\033[36m%-15s\033[0m - %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5)  } ' $(MAKEFILE_LIST)

start-sqs-emulator: ## Inicializa o emulador do AWS SQS localmente
	docker-compose -f docker-compose.yaml up -d

down-sqs-emulator: ## Para o emulador
	docker-compose -f docker-compose.yaml down

logs-sqs-emulator: ## Exibe os logs do emulador
	docker-compose -f docker-compose.yaml logs

create-aws-profile: ## Cria um perfil fake do aws cli
		aws configure set aws_access_key_id faker --profile dev-local
		aws configure set aws_secret_access_key faker --profile dev-local
		aws configure set format json --profile dev-local
		aws configure set region us-east-1 --profile dev-local

create-new-queue-sqs: ## Cria uma nova fila no sqs. Usage: make create-new-queue-sqs name=fila
		aws --endpoint-url=${SQS_ENDPOINT} sqs create-queue --queue-name ${name} --profile dev-local

list-queue-sqs:
	   aws sqs list-queues --endpoint-url=${SQS_ENDPOINT} --profile dev-local | jq ".QueueUrls"

seed-msg-queue-sqs: ## Envia dados para fila. Usage: make seed-msg-sqs name=fila
		aws sqs send-message-batch --endpoint-url=${SQS_ENDPOINT} --queue-url ${SQS_ENDPOINT}/${PARAM_DEFAULT}/${name} \
		--entries file://seeds/message-batch.json --profile dev-local \
		| jq

list-msg-queue-sqs: ## lista mensagens de uma fila. Usage: make list-msg-queue-sqs name=fila
	   aws --endpoint-url=${SQS_ENDPOINT} sqs receive-message \
	   --queue-url ${SQS_ENDPOINT}/${PARAM_DEFAULT}/${name} --max-number-of-messages 10 \
	   | jq

purge-msg-queue-sqs: ## Expurga todas as mensagens de uma fila. Usage: make purge-msg-queue-sqs name=fila
	   aws --endpoint-url=${SQS_ENDPOINT} sqs purge-queue \
	   --queue-url ${SQS_ENDPOINT}/${PARAM_DEFAULT}/${name} --profile dev-local
