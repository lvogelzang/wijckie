#!/bin/bash

WIJCKIE_HOME=~/git/wijckie

cd $WIJCKIE_HOME/back-end/
source venv/bin/activate
python manage.py makemigrations
deactivate
