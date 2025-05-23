# wijckie

Personal start page

### How the front-end is built

- Setup front-end:  
  `yarn create vite front-end --template react-ts`  
  `yarn install`
- Add Prettier, add configuration, write changes:
  `yarn add --dev prettier`
  `nano .prettierrc`
  `yarn prettier --write 'src/**/*.{js,ts,tsx}'`
- Add SASS, Bootstrap
  `yarn add sass`
  `yarn add bootstrap react-bootstrap`
- Add routing
  `yarn add react-router-dom`
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
- `python manage.py runserver`
