#!/bin/bash

WIJCKIE_HOME=~/git/wijckie

cd $WIJCKIE_HOME/generate-tsx
npx ts-node generate-forms.ts

cd $WIJCKIE_HOME/front-end/
yarn prettier --write 'src/forms/**/*.{js,ts,tsx}'
