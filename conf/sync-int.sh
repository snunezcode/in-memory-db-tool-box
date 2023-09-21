#!/bin/bash 

rm -rf ../../../projects-int/db-top-monitoring/server/*
rm -rf ../../../projects-int/db-top-monitoring/frontend/*
rm -rf ../../../projects-int/db-top-monitoring/conf/*
rm -rf ../../../projects-int/db-top-monitoring/www/*

# Sync Server
cp -r ../server/api.core.js ../../../projects-int/db-top-monitoring/server/
cp -r ../server/aws-exports.json ../../../projects-int/db-top-monitoring/server/
cp -r ../server/package.json ../../../projects-int/db-top-monitoring/server/


# Sync Frontend
cp -r ../frontend/public ../../../projects-int/db-top-monitoring/frontend/
cp -r ../frontend/src ../../../projects-int/db-top-monitoring/frontend/
cp -r ../frontend/package.json ../../../projects-int/db-top-monitoring/frontend/
cp -r ../frontend/www ../../../projects-int/db-top-monitoring/frontend/

# Sync Conf
cp -r ../conf/api.core.service ../../../projects-int/db-top-monitoring/conf/
cp -r ../conf/DBTopMonitoringSolution.template ../../../projects-int/db-top-monitoring/conf/
cp -r ../conf/server.conf ../../../projects-int/db-top-monitoring/conf/
cp -r ../conf/setup.sh ../../../projects-int/db-top-monitoring/conf/

cd ../../../projects-int/db-top-monitoring/

# Push to git

id=$(date '+%Y.%m.%d.%H.%M.%S')
echo "$id"
git add .
git commit -m "v.$id"
git push



