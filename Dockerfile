FROM node:22-slim

WORKDIR /app

# Copia primeiro só os manifestos, para o Docker cachear a camada de
# dependências e não reinstalar tudo a cada mudança de código.
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do projeto. O .dockerignore mantém node_modules, .git,
# .specs, _docs e qualquer .env fora do contexto de build.
COPY . .

# Falha o build se o TypeScript não compilar — mais barato descobrir aqui
# do que só ao rodar o container.
RUN npm run check

# Usuário sem privilégios, em vez de rodar como root dentro do container.
RUN groupadd --system app && useradd --system --gid app --create-home app
USER app

# Nenhuma chave de API é copiada para a imagem. Passe TYPESAFE_API_KEY em
# tempo de execução (bind mount do .env, ou -e / --env-file do Docker),
# nunca durante o build. Veja _docs/setup.md para os comandos completos.
CMD ["npm", "run", "frustration-check"]
