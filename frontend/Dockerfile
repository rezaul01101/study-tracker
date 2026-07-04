# ---- build ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Empty string means "use the current origin" (relative /api and /uploads
# requests) — see frontend/src/api.js. Local `npm run dev` never sets this,
# so that workflow is unaffected.
ARG VITE_API_ORIGIN=""
ENV VITE_API_ORIGIN=$VITE_API_ORIGIN

RUN npm run build

# ---- serve ----
FROM nginx:stable-alpine AS serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
