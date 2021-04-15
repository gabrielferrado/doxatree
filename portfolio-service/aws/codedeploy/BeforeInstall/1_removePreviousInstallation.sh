#!/bin/sh

deployment_dir=/opt/microservices-demo/portfolio-service
if [ -d "$deployment_dir" ] && [ -x "$deployment_dir" ]; then
  cd /opt/microservices-demo/portfolio-service

  rm -rf *
fi
