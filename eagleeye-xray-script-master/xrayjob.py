import sys
import os
import json
import requests

def octopus_get_mapping_apps():

    url = "http://rc-lx2561:5000/app_name_mappings"
    headers = {'content-type': 'application/json' }

    try:
        response = requests.get(url, headers)
    except:
        exit("Error: octopus_get_mapping_apps") 

    return response.json       


def octopus_get_last_modified(appname):

    url = "http://rc-lx2561:5000/artifactory/app/path_info/{}".format(appname)
    headers = {'content-type': 'application/json' }

    try:
        response = requests.get(url, headers)
    except:
        exit("Error: octopus_get_last_modified")
        
    return response["lastModified"]

if len(sys.argv) != 2:
    print("Usage: {} <application_name>".format(sys.argv[0]))
    exit(1)

gl_appname = sys.argv[1]
gl_app_mappings = octopus_get_mapping_apps()

with open('app_timestamps.json') as json_file:
    data = json.load(json_file)

    if gl_appname not in list(gl_app_mappings):
        print("Application {} is not in the mapping list".format(gl_appname))
        exit(2)

    last_modified_time = octopus_get_last_modified(gl_appname)

    if gl_appname not in list(data):
        print("Application {} is not in the timestamp list".format(gl_appname))
        data[gl_appname] = last_modified_time
    
    elif data[gl_appname] != last_modified_time:

        url = "http://rc-lx2561:5000/xray/vulns/feedvulns"
        headers = {'content-type': 'application/json' }

        artifactory_path = gl_app_mappings[gl_appname]['artifactory_path'].split('/')
        data[gl_appname] = last_modified_time
        
        l_appresource_name = artifactory_path[0]
        l_appresource_val = artifactory_path[1]
        
        data = {
            "watchname" : gl_appname,
            "resource_name" : l_appresource_name,
            "resource_value" : l_appresource_val,
            "description" : gl_appname
            }
            
        response = requests.get(url, headers= headers, data=json.dumps(data), verify=False)
        
        if response.status_code != 200:
            print("EROR - Script")
            exit(response.status_code)   

    