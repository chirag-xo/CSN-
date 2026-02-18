# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Build args for environment variables involved in build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# Add other VITE_ public vars here if needed
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

ARG VITE_WEB3FORMS_KEY
ENV VITE_WEB3FORMS_KEY=$VITE_WEB3FORMS_KEY

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose port (Cloud Run sets this to 8080 by default)
EXPOSE 8080

# Use default nginx entrypoint which handles envsubst
CMD ["nginx", "-g", "daemon off;"]
