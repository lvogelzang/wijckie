#!/bin/bash

WIJCKIE_HOME=~/git/wijckie

cd $WIJCKIE_HOME/front-end/
yarn i18next 'src/**/*.{ts,tsx}'

cd $WIJCKIE_HOME/generate-tsx
npx ts-node generate-translations.ts
