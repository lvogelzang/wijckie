#!/bin/bash

cd $APP_HOME

if [ "$1" = "init-environment" ];
then 
    python manage.py createsuperuser --noinput
    echo "Init done"
else
    python manage.py migrate
    python manage.py collectstatic --noinput
    gunicorn -w 3 -b :8000 wijckie.wsgi:application
fi
