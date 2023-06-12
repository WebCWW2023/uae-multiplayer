#!/bin/bash
#Stopping existing node servers
echo "Stopping uae Multiplayer"

# pm2 stop --silent office-mp 
# pm2 delete --silent office-mp 

pm2 describe uae-mp > /dev/null
RUNNING=$?

if [ "${RUNNING}" == 0 ]; then
  pm2 delete --silent uae-mp
fi;