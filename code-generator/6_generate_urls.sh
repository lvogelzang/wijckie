#!/bin/bash

source venv/bin/activate
python -m generate.generate_urls
python -m isort ~/git/wijckie/back-end/
python -m black ~/git/wijckie/back-end/
deactivate
