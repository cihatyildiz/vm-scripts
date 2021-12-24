import psutil
import datetime
import os
import platform
import sys
import math
import time
import csv

def memory_size_in(nbytes):
    if nbytes == 0:
        return "%s %s" % ("0", "B")
    nunit = int(math.floor(math.log(nbytes, 1024)))
    nsize = round(nbytes/(math.pow(1024, nunit)), 2)
    return '%s %s' % (format(nsize, ".2f"), metric[nunit])

def getProcessInfo(process_id):
    ps_list = []
    ps = psutil.Process(process_id)
    ps_list.append(ps.as_dict(attrs=['pid', 'name']))
    ps_chain = ps.children(recursive=True)
    for singlep in ps_chain:
        ps_list.append(singlep.as_dict(attrs=['pid', 'name']))
    ps_name = ps.name()
    #calculate the usage 
    ps_percent=0.0
    ps_memory=0
    for sp in ps_list:
        xps = psutil.Process(sp['pid'])
        ps_percent = ps_percent + xps.cpu_percent()
        xps_mu = xps.memory_info().rss/1024/1024
        ps_memory = ps_memory + xps_mu
        #print(ps_memory, ps_percent)
    #print(ps_list)
    return [ ps_name, ps_percent, ps_memory]

def logResults(filename, data):
    # convert time in excel : "=(E2/86400)+DATE(1970,1,1)"
    with open(filename, "a") as csvfile:
        wdata = "{},{},{},{},{}\n".format(data[0], data[1], data[2], data[3], data[4])
        csvfile.write(wdata)
    return

if __name__ == "__main__":

    logFile = "r7agent_log.csv"
    process_id = sys.argv[1]
    if not psutil.pid_exists(int(process_id)):
        print("Process {} does not exist!!", process_id)
        exit()
    logResults(logFile, ["Process Name", "CPU Usage", "Memory Usage (MB)", "Hostname", "Time Epoch"])
    while True:
        ps_info = getProcessInfo(int(process_id))
        ps_info.append(platform.node())
        ps_info.append(time.time())
        print(ps_info)
        logResults(logFile, ps_info)
        time.sleep(30)
        