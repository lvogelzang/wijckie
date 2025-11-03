#!/bin/bash

source venv/bin/activate
python -m generate.generate_tables
deactivate

# cd ~/git/wijckie/front-end/
# yarn prettier --write 'src/**/*.{js,ts,tsx}'
