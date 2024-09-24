#!/bin/bash

NODE_PATH=$(which node)

# Create a new crontab file
echo "0 0 * * * $NODE_PATH /usr/src/app/src/cron/fetch-equipments.mjs >> /var/log/cron.log 2>&1" >>/etc/cron.d/my-cron-jobs
echo "0 */8 * * * $NODE_PATH /usr/src/app/src/cron/fetch-measurements.mjs >> /var/log/cron.log 2>&1" >>/etc/cron.d/my-cron-jobs
echo "0 7 * * * $NODE_PATH /usr/src/app/src/cron/irrigation-reports.mjs >> /var/log/cron.log 2>&1" >>/etc/cron.d/my-cron-jobs
echo "0 14 * * * $NODE_PATH /usr/src/app/src/cron/newsletter.mjs >> /var/log/cron.log 2>&1" >>/etc/cron.d/my-cron-jobs

chmod +x /usr/src/app/src/cron/fetch-equipments.mjs
chmod +x /usr/src/app/src/cron/fetch-measurements.mjs
chmod +x /usr/src/app/src/cron/irrigation-reports.mjs
chmod +x /usr/src/app/src/cron/newsletter.mjs

# Give execution rights on the cron job
chmod 0644 /etc/cron.d/my-cron-jobs

# Apply the cron job
crontab /etc/cron.d/my-cron-jobs

# Create the log file to be able to run tail
touch /var/log/cron.log

# Run the cron service in the foreground
cron && tail -f /var/log/cron.log
