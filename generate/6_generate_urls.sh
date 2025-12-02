#!/bin/bash

WIJCKIE_HOME=~/git/wijckie

cd $WIJCKIE_HOME/generate-py/
source venv/bin/activate
python -m generate.urls
python -m isort $WIJCKIE_HOME/back-end/
python -m black $WIJCKIE_HOME/back-end/
deactivate
