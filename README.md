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
- Sync models/endpoints with back-end schema  
  `npx orval`
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

### Refactor todos:

- File uploads
- Object based permissions
- Remove magic code login: https://news.ycombinator.com/item?id=44819917
- Put everything in private subnets, 2 options:
  - Back-end in AWS App Runner with a VPC endpoints (costly) to reach smtp/rds/..
  - Back-end in ECS service in private subnet, with load balancer (costly) to reach back-end

### How coverage works:

- The vite-plugin-istanbul package keeps track of all covered lines during runtime. Enter `window.__coverage__` in your browser console to view the current status of the coverage. The istanbul plugin is added in vite.config.ts, arrange included and excluded files there.
- The @cypress/code-coverage adds tools to generate coverage reports when running Cypress. First it collects coverage data in the /test/.nyc_output folder. When tests are done, a report is written to /test/coverage/lcov-report/index.html.
