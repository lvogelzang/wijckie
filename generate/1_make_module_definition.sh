#!/bin/bash

WIJCKIE_HOME=~/git/wijckie

cd $WIJCKIE_HOME/generate-py/
source venv/bin/activate
python -m generate.definitions
deactivate
