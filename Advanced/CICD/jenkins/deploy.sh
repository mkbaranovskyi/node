#!/bin/bash
set -e  # Exit on any error

echo "Deployment starts..."
cd /home/ubuntu/ecoski-mvp-snow-app-tr427-web

echo "Fetching latest changes..."
git switch development
git pull origin development

# Without this step, `yarn` and `pm2` won't be available
echo "Loading nvm..."
source ~/.nvm/nvm.sh

echo "Installing dependencies..."
yarn install --immutable

echo "Building the project..."
yarn build

echo "Restarting/starting pm2 process..."
if ! pm2 restart front; then
  echo "PM2 process 'front' not found. Starting a new process..."
  pm2 stop front || true  # Gracefully stop if running
  pm2 delete front || true  # Remove old process if exists
  pm2 start "yarn start" --name front -i max
fi 
pm2 save

echo "Deployment finished successfully!"
