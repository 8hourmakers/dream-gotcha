#!/usr/bin/env bash

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

mkdir configs/
mkdir log/
mkdir resources/
mkdir resources/audio/

npm install
NODE_ENV=production npm run build
