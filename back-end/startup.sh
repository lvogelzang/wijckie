#!/bin/bash
python3 manage.py migrate
python3 manage.py collectstatic --noinput
gunicorn -w 3 -b :8000 wijckie.wsgi:application
