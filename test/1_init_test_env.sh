#!/bin/sh

FRONTEND_HOME="/Users/lodewijckvogelzang/git/wijckie/front-end"
BACKEND_HOME="/Users/lodewijckvogelzang/git/wijckie/back-end"

# Remove database from previous run
rm -f $BACKEND_HOME/db.sqlite3

# Remove uploaded media from previous run
rm -rf $BACKEND_HOME/media

# Activate Python environment
source $BACKEND_HOME/venv/bin/activate

# Apply migrations to fresh database
python $BACKEND_HOME/manage.py migrate

python $BACKEND_HOME/manage.py createsuperuser --email "admin@studiogoes.com" --username "Admin" --email "admin@studiogoes.com" --noinput

# Setup application
cat $BACKEND_HOME/test_setup/script.py | python $BACKEND_HOME/manage.py shell
