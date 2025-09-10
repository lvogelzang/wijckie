# Wijckie

Personal start page

## Back-end

### Main commands

- Create virtual environment  
  `python3 -m venv venv`
  `source venv/bin/activate`
- Install dependencies  
  `pip install -r requirements.txt`
- Add new dependencies  
  `pip install black django djangorestframework`
  `pip freeze > requirements.txt`
- Create migrations  
  `python manage.py makemigrations`
- Run migrations  
  `python manage.py migrate`
- Rollback migration to X  
  `python manage.py migrate wijckie_models 0003`
- Write and compile translations  
  `python manage.py makemessages -l nl -l en_GB -i 'venv/*'`
  `python manage.py compilemessages -i 'venv/*'`
- Run back-end  
  `DJANGO_RUNSERVER_HIDE_WARNING=true python manage.py runserver`

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
- Configure and run Prettier  
  `nano .prettierrc`
  `yarn prettier --write 'src/**/*.{js,ts,tsx}'`
- Run front-end  
  `yarn run dev`

## Nginx

To securely run our back-end in production, we can not use the `manage.py runserver` command: https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/#switch-away-from-manage-py-runserver. We deploy Django in Gunicorn as a WSGI application. Gunicorn is, for example, useful for handling concurrent requests by offloading requests to parallel workers. Nginx on top of this is useful for handling requests for static files. The nginx folder in this repo contains the configuration to build our Nginx container.

## Boot dev environment

AppleScript to boot a dev environment on MacOS:

```
my makeFirstTab("cd ~/git/wijckie/back-end/ && source venv/bin/activate && DJANGO_RUNSERVER_HIDE_WARNING=true python manage.py runserver 8000")
my makeNewTab("cd ~/git/wijckie/front-end/ && yarn run dev --host")

do shell script "/usr/local/bin/docker desktop start"
do shell script "c=0; while ! /usr/local/bin/docker desktop status | grep 'running'; do echo 'Waiting for Docker to start...'; ((c++)) && ((c==10)) && break; sleep 1; done && /usr/local/bin/docker run --rm --name mailcrab --detach -p 1080:1080 -p 1025:1025 marlonb/mailcrab:latest &>/dev/null &"

on makeFirstTab(shellCmdToRun)
  tell application "Terminal"
    activate
    do script shellCmdToRun as text in selected tab of front window
  end tell
end makeFirstTab

on makeNewTab(shellCmdToRun)
  tell application "Terminal"
    activate
    tell application "System Events" to ¬
      tell menu 1 of menu item 2 of menu 1 of menu bar item 3 of menu bar 1 ¬
        of application process "Terminal" to click (the first menu item ¬
        whose value of attribute "AXMenuItemCmdChar" is "T" and ¬
        value of attribute "AXMenuItemCmdModifiers" is 0)
    do script shellCmdToRun as text in selected tab of front window
  end tell
end makeNewTab

tell application "Visual Studio Code"
  open "Users:lodewijckvogelzang:dev:workspaces:Wijckie.code-workspace"
end tell

tell application "Sourcetree"
  activate
end tell
```

## Test

Cypress is used to run integration tests on a local environment.

1. Initialize a clean environment by running the `1_init_test_env.sh` script. This removes the current database, runs all migrations, and sets up a staticly defined environment. Developers are allowed to add whatever they want in the testsetup files (back-end/test_setup/..) to enricht the default test environment, as long as the tests keep passing.
2. Run `2_open_cypress.sh` to open the interactive window of Cypress to run newly created tests.
3. Run all tests consequently, collecting coverage data all together, with the `3_run_all_cypress.sh` script.
4. Open coverage report with `4_open_coverage.sh`

#### How Cypress works:

Cypress runs the tests from test/cypress/e2e/\*.cy.ts in a browser environment. Cypress also runs a node process in the background, which provides options to do more complex actions in the background like executing SQL queries. These background actions are exposed via support/commands.ts.

#### How coverage works:

- The vite-plugin-istanbul package keeps track of all covered lines during runtime. Enter `window.__coverage__` in your browser console to view the current status of the coverage. The istanbul plugin is added in vite.config.ts, arrange included and excluded files there.
- The @cypress/code-coverage adds tools to generate coverage reports when running Cypress. First it collects coverage data in the /test/.nyc_output folder. When tests are done, a report is written to /test/coverage/lcov-report/index.html. Run all specs sequentially (there's a special play button visible when you're opening a E2E spec), to collect coverage of the whole test suite.

# Refactor todos:

- Setup development environment with Cursor in Docker.
- File uploads
  - Check images to be have whitelisted extensions
  - Scale images to a couple of fixed dimensions
  - Compress uploads
  - Limit upload size
  - Clean up orphans
- Object based permissions
- Remove magic code login: https://news.ycombinator.com/item?id=44819917
- Put everything in private subnets, 2 options:
  - Back-end in AWS App Runner with a VPC endpoints (costly) to reach smtp/rds/..
  - Back-end in ECS service in private subnet, with load balancer (costly) to reach back-end
