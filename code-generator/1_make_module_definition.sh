#!/bin/bash

source venv/bin/activate
python -m generate.module_definitions
deactivate

npx prettier --write 'modules/*.json'
