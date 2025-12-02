# Wijckie code generator - Python

Generate consistent code for the Wijckie project

### Main commands

- Create virtual environment  
  `python3 -m venv venv`
  `source venv/bin/activate`
  `pip install -r requirements.txt`
  `pip install black`
  `pip freeze > requirements.txt`
- Use VSCode
  - install VSCode extensions [isort, Black Formatter]
  - Use a separate project for this Generate project so VSCode will recognize the venv. See .vscode/settings.json for shared settings.
  - Check if Black runs automatically: add a couple newlines to a .py file and save in VSCode -> are they removed after saving?
  - Check if isort runs automatically: shuffle imports in a .py file and save in VSCode -> are the imports reordered after saving?
