# wijckie

Personal start page

## Front-end

### Main commands

- Install dependencies  
  `yarn install`
- Add new dependencies  
  `yarn add js-cookie`  
  `yarn add --dev @types/js-cookie`
- Sync translations  
  `npx i18next 'src/**/*.{ts,tsx}'`
- Run application  
  `yarn run dev`

### How the front-end is built

- Setup front-end:  
  `yarn create vite front-end --template react-ts`  
  `yarn install`
- Add Prettier, add configuration, write changes:  
  `yarn add --dev prettier`
  `nano .prettierrc`
  `yarn prettier --write 'src/**/*.{js,ts,tsx}'`
- Add packages and type definitions:  
  `yarn add sass bootstrap react-bootstrap react-router-dom react-hook-form axios js-cookie`
  `yarn add --dev @types/js-cookie @types/node`
- Run application  
  `yarn run dev`

### How the back-end is built

- `python3 -m venv venv`
- `source venv/bin/activate`
- `pip install black django djangorestframework`
- `pip freeze > requirements.txt`
- `django-admin startproject wijckie .`
- `python manage.py migrate`
- `python manage.py createsuperuser`
- `DJANGO_RUNSERVER_HIDE_WARNING=true python manage.py runserver`
