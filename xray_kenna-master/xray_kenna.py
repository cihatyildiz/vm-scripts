import requests
import urllib3
import json
from time import sleep

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class KennaXray:

    def __init__(self):
        self.xray_authorization_key = "Y2EzNDk5NTpjNHMzYjZiOV5e"
        self.application_map = []
        pass

    def xray_get_all_watches(self):

        url = "https://<jfrogxray-server>/api/v2/watches"

        #headers = {'content-type': 'application/json', 'authorizaion': self.authorization }

        headers = {
            'Content-Type': "application/json",
            'Authorization': "Basic {}".format(self.xray_authorization_key),
            'User-Agent': "PostmanRuntime/7.15.2",
            'Accept': "*/*",
            'Cache-Control': "no-cache",
            'Host': "<jfrogxray-server>",
            'Accept-Encoding': "gzip, deflate",
            'Connection': "keep-alive",
            'cache-control': "no-cache"
            }

        try:
            response = requests.get(url, headers=headers, verify=False)
        except requests.exceptions.ConnectionError:
            exit("Conection refused")

        if response.status_code != 200:
            exit('GET /Users/ {}'.format(response.status_code))
        
        print(json.dumps(json.loads(response.text), indent=4, sort_keys=True))
        #TODO: parse and format
        return

    def xray_get_violations(self, watch_name):

        url = "https://<jfrogxray-server>/api/v1/violations"

        headers = {
            'Content-Type': "application/json",
            'Authorization': "Basic {}".format(self.xray_authorization_key),
            'User-Agent': "PostmanRuntime/7.15.2",
            'Accept': "*/*",
            'Cache-Control': "no-cache",
            'Host': "<jfrogxray-server>",
            'Accept-Encoding': "gzip, deflate",
            'Connection': "keep-alive"
            }

        data = {
                    "filters": {
                        "name_contains": "Denial of service attack",
                        "violation_type": "Security",
                        "watch_name": watch_name,
                        "min_severity": "Medium",
                        "created_from": "2018-06-06T12:22:16+03:00" #TODO: generate this time stamp
                    },
                    "pagination": {
                        "order_by": "updated",
                        "limit": 100,
                        "offset": 1
                    }
                }
        
        try: 
            response = requests.post(url, headers, data, verify=False) 
        except requests.exceptions.ConnectionError:
            exit("Conection connection error occured")

        if response.status_code != 200:
            exit("POST //api/v1/violations/ {}".format(response.status_code))

        #TODO: Work on vulnerability data

        return
    

    def xray_create_awatch(self):

        url = " https://<jfrogxray-server>/api/v2/watches"

        headers = {
            'Content-Type': "application/json",
            'Authorization': "Basic {}".format(self.xray_authorization_key),
            'User-Agent': "PostmanRuntime/7.15.2",
            'Accept': "*/*",
            'Cache-Control': "no-cache",
            'Host': "<jfrogxray-server>",
            'Accept-Encoding': "gzip, deflate",
            'Connection': "keep-alive"
            }
        
        data = {
            "general_data": {
                "name": "feature-01",
                "description": "watch for user: xxxx, for xxx-web feature-01",
                "active": True
            },
            "project_resources": {
                "resources": [
                    {
                        "type": "repository",
                        "bin_mgr_id": "Lab",
                        "name": "xray-temp",
                        "filters": [
                            {
                                "type": "path-regex",
                                "value": "xxxx/feature-01"
                            }
                        ]
                    }
                ]
            },
            "assigned_policies": [
                {
                    "name": "critical-severity",
                    "type": "security"
                },
                {
                    "name": "high-severity",
                    "type": "security"
                },
                {
                    "name": "medium-severity",
                    "type": "security"
                },
                {
                    "name": "low-severity",
                    "type": "security"
                }
            ]
        }

        try: 
            response = requests.post(url, headers , json.dumps(data), verify=False ) 
        except requests.exceptions.ConnectionError:
            exit("Conection connection error occured")

        if response.status_code != 200:
            exit("POST //api/v1/violations/ {}".format(response.status_code))

        return #TODO: Not completed


    def octopus_get_mapping_apps(self):

        app_names = []

        url = "http://<api-server>/app_name_mappings"
        headers = {'content-type': 'application/json' }

        try:
            response = requests.get(url, headers)
        except:
            exit("Error: get_mapping_apps")
        
        print(response.text)
        for item in json.loads(response.text):
            app_names.append(item)
            print(item)

        for appname in app_names:
            self.application_map.append(json.loads(response.text)[appname]['artifactory_path'])
        
        print(self.application_map)

        return

    def octopus_get_last_modified_time_of_the_app(self, app_name):

        url = "http://<api-server>/artifactory/app/path_info/{}".format(app_name)
        headers = {'content-type': 'application/json' }

        try:
            response = requests.get(url, headers)
        except:
            exit("Error: get_last_modified_time_of_the_app")
        
        if response.status_code != 200:
            exit("POST ../artifactory/app/path_info/ {}".format(response.status_code))
        
        print(response.text)
        pass

    # ------------------------------------------------------------------------------
    #          _          __________                              _,
    #      _.-(_)._     ."          ".      .--""--.          _.-{__}-._
    #    .'________'.   | .--------. |    .'        '.      .:-'`____`'-:.
    #   [____________] /` |________| `\  /   .'``'.   \    /_.-"`_  _`"-._\
    #   /  / .\/. \  \|  / / .\/. \ \  ||  .'/.\/.\'.  |  /`   / .\/. \   `\
    #   |  \__/\__/  |\_/  \__/\__/  \_/|  : |_/\_| ;  |  |    \__/\__/    |
    #   \            /  \            /   \ '.\    /.' / .-\                /-.
    #   /'._  --  _.'\  /'._  --  _.'\   /'. `'--'` .'\/   '._-.__--__.-_.'   \
    #  /_   `""""`   _\/_   `""""`   _\ /_  `-./\.-'  _\'.    `""""""""`    .'`\
    # (__/    '|    \ _)_|           |_)_/            \__)|        '       |   |
    #   |_____'|_____|   \__________/   |              |;`_________'________`;-'
    #    '----------'    '----------'   '--------------'`--------------------`
    #      S T A N          K Y L E        K E N N Y         C A R T M A N
    # ------------------------------------------------------------------------------
    # ->>>>> GO GO GO
    # ------------------------------------------------------------------------------

    def run(self):
        self.octopus_get_mapping_apps()
        for app in self.application_map:
            self.octopus_get_last_modified_time_of_the_app(app)
        return

if __name__ == "__main__":
    
    xray = KennaXray()
    xray.xray_get_all_watches()
    xray.octopus_get_mapping_apps()
    xray.octopus_get_last_modified_time_of_the_app("xxx-web")
    xray.xray_create_awatch()

    


    #xray.run()