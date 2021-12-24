import json
import os
import subprocess

def save_scan_status(scan_id, ip_address, scan_status):
    nexpose_file = open('nexpose_scans.json', 'r')
    nexpose_data = json.load(nexpose_file)
    nexpose_data[ip_address]={
            'ip_address': ip_address,    
            'scan_id': scan_id, 
            'scan_status': scan_status
        }

    nexpose_file.close()
    with open('nexpose_scans.json', 'w') as nexpose_file:
        json.dump(nexpose_data, nexpose_file)
    nexpose_file.close()

    return 

def run_nexpose_checker():
    p = subprocess.Popen([sys.executable, 'NexposeScan.py'],
            stdout=subprocess.PIPE, 
            stderr=subprocess.STDOUT)
    return

save_scan_status(11221, "11.22.30.44", "running")