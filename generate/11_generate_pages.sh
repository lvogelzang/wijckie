#!/bin/bash

WIJCKIE_HOME=~/git/wijckie

cd $WIJCKIE_HOME/generate-tsx
npx ts-node generate-pages.ts

cd $WIJCKIE_HOME/front-end/
yarn prettier --write 'src/pages/**/*.{js,ts,tsx}'
