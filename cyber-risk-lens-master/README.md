# cyber-risk-lens

## DEV Setup
1. git clone
2. Make sure only following lines are uncommented in your Dockerfile
```
FROM node
EXPOSE 3000
ENV PORT=3000
COPY ./cyber-risk-lens /cyber-risk-lens
WORKDIR /cyber-risk-lens
```
3. docker-compose up -d --build
4. docker exec it cyber-risk-lens bash
5. npm run start


That's all
