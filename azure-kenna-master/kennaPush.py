import sys
import json

vulnerabilities = []

def processAzureData(findings):
    print(findings)
    count = 0
    for finding in findings:
        description = finding['aliases']['Microsoft.Security/assessments/metadata']['description']
    print(str(count))

if __name__ == "__main__":
    if len(sys.argv) != 2 :
        print("Usage: kennapush.py <filename>")
    else:
        with open(sys.argv[1], "r") as f:
            data = json.load(f)
            processAzureData(data)