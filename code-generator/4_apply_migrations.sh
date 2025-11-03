#!/bin/bash

cd ~/git/wijckie/back-end/
source venv/bin/activate
python manage.py migrate
deactivate
