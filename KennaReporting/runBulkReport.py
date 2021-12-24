import sys
import os.path
from os import path
import json
import requests
from jinja2 import FileSystemLoader, Environment

class reportApp:


    def __init__(self, config_file = "config.json"):

        # global report information
        self.reportList = list()

        # check config file exist
        if not os.path.exists(config_file):
            raise Exception("The file {} doesn't exist".format(config_file))

        raw_config = open(config_file, "r")
        json_config = json.load(raw_config)

        # set global properties
        self.debug_mode = json_config['settings']['debug_mode']
        self.kenna_api_key = json_config['settings']['kenna_api_key']

        # get information for reports
        for reportProp in json_config['reports']: #TODO: loop not working
            self.reportList.append(reportProp)
            #print(reportProp)
            #print("###")

        #print(self.reportList)


    def getKennaAssetGroupInformation(self, risk_meter_id):

        url = "https://api.kennasecurity.com/asset_groups/" + risk_meter_id
        headers = {
            "X-Risk-Token": self.kenna_api_key
        }
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise Exception("bad reques - getAssetGroupInformation - code {}".format(response.status_code))
        
        return response.json()

    def createHtmlReport(self, ag_data):
        # create Html file
        return


    def runReportProcess(self):

        # Get data from Kenna
        for reportItem in self.reportList:
            ag_info = self.getKennaAssetGroupInformation(reportItem['kenna_risk_meter_id'])

            # Generate html report


        print("#DONE")


if __name__ == "__main__":
    reports = reportApp()
    reports.runReportProcess()
    

    

