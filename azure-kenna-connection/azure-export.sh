#!/bin/bash 

# =======================================================
# Run a resource query and save results
# Globals:
#   AZ_QUERY_FILE
#   WORKDIR
# Arguments:
#   None
# =======================================================

AZ_QUERY_FILE=$3
AZ_LOGIN_FILE='azure_login.json'

# Login to azure infrastructure
# read -p "Azure username: " AZ_USER
# read -sp "Azure password: " AZ_PASS && echo
# az login -u $AZ_USER -p $AZ_PASS
az login -u $1 -p $2 > $AZ_LOGIN_FILE

# Run resource query and save the results
az graph query -q "securityresources | where type == 'microsoft.security/assessments' | where * contains 'vulnerabilities'" --first 5000 > $AZ_QUERY_FILE
