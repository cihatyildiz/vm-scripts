FROM ubuntu
RUN apt-get update && apt-get install -y python3 python3-pip git cron curl
ENV GIT_SSL_NO_VERIFY=1
COPY ./dr-octopus /crs/dr-octopus
WORKDIR /crs/dr-octopus/
RUN pip3 install -r requirements.txt
EXPOSE 5000
#if in dev, comment the line below
ENTRYPOINT ["python3", "dr-octopus/app.py"]
