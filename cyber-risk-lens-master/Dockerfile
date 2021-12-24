# # Dockerfile for dev-env
FROM node
EXPOSE 3000
ENV PORT=3000
COPY ./cyber-risk-lens /cyber-risk-lens
WORKDIR /cyber-risk-lens
RUN npm install
# comment line below if you dont want webapp to start automatically when container is built
ENTRYPOINT ["npm", "run", "start"]

# FROM nginx:1.15.2-alpine
# COPY ./cyber-risk-lens/build /var/www
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY /secrets/nginx-self-signed-priv.key /etc/ssl/CRT/nginx-self-signed-priv.key
# COPY /secrets/nginx-self-signed-cert.key /etc/ssl/CRT/nginx-self-signed-cert.crt

# Expose ports
# EXPOSE 80
# EXPOSE 443

# Entrypoint
# ENTRYPOINT ["/bin/sh", "-c", "nginx -g 'daemon off;'; nginx -s reload;"]
