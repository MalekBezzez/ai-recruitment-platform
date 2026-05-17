# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Installe d’abord les deps (cache Docker efficace)
COPY package*.json ./
RUN npm ci --no-audit || npm install --legacy-peer-deps

# Copie le reste et build
COPY . .
# (Optionnel) passe ton URL backend au build si tu utilises REACT_APP_API_URL dans le code
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV DISABLE_ESLINT_PLUGIN=true

RUN npm run build

# ---- Runtime stage ----
FROM nginx:alpine
# Conf Nginx spéciale SPA + proxy /api
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copie les fichiers statiques
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

# Healthcheck simple
HEALTHCHECK CMD wget -qO- http://localhost/healthz || exit 1
