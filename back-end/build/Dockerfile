# pull official base image
FROM python:3.12.10-slim-bookworm

# create directory for the app user
ENV APP_HOME=/home/app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# create the app user
RUN addgroup --system app && adduser --system --group app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# prepare for installing dependecies
RUN apt-get update

# install psycopg2 dependencies
RUN apt-get -y install gcc python3-dev libpq-dev postgresql wget

# Clean after installing Debian dependecies
RUN apt-get clean

# install dependencies
RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# copy project
COPY wijckie/ wijckie/
COPY manage.py .
COPY build/entrypoint.sh .
RUN chmod +x entrypoint.sh

# chown all the files to the app user
RUN chown -R app:app .

# change to the app user
USER app

ENTRYPOINT ["./entrypoint.sh"]
