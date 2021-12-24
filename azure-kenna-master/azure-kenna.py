import sys, os, json
import requests, getpass, re


file_azure_findings = "azure_security_findings.json"
kenna_api_key = "6BLJEWyHmNGsS2HfjSh8xDeEqsLBKySgrjQDrGXKJB36_Betz-6JJbahnAtdcbtD" 


def getAzureCredentials():
    username = input("Azure username: ")
    password = getpass.getpass("Azure password: ")
    return username, password


def prepFindingsForKenna(findings):
    print(len(findings))
    vulns = []
    for finding in findings:
        description = finding['properties']['metadata']['description']
        cves=re.findall(r"CVE-\d{4}-\d{4,7}", description)
        summvary= finding['properties']['metadata']['displayName']
        if len(cves) > 0:
            summvary= finding['properties']['metadata']['displayName']
            name = finding['properties']['resourceDetails']['Id']
            vuln = {
                    "cve_id" : cves[0],
                    "primary_locator" : "url",
                    "url" : name
                }
            vulns.append(vuln)
            print(vuln)
    return vulns

def push2Kenna(vuln):
    url = 'https://api.kennasecurity.com/vulnerabilities'
    headers = {
        'Content-Type' : "application/json",
        'X-Risk-Token' : kenna_api_key
    }
    data = {
        "vulnerability": vuln
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    print(response.text)
    

if __name__ == "__main__":
    az_user, az_pass = getAzureCredentials()
    az_command = "bash azure-export.sh {} {} {}".format(az_user, az_pass, file_azure_findings)
    os.system(az_command)
    with open(file_azure_findings) as f:
        data = json.load(f)
        vulns_kenna = prepFindingsForKenna(data)
        for vuln in vulns_kenna:
            push2Kenna(vuln)
            