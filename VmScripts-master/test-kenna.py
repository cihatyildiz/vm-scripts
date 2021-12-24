import sys,os
from libs.kenna import Kenna

kenna_api_token = os.environ['KENNA_TOKEN'].replace('"', "")
myKenna = Kenna(kenna_api_token)


print("---------findAssetCountByServiceTicketId---------DONE")
# result = myKenna.findAssetCountByServiceTicketId("CRVM-887")
# print(str(result))

print("---------findAssetsByServiceTicketId---------DONE")
# result = myKenna.findAssetsByServiceTicketId("CRVM-887")
# print(len(result))

print("---------findAssetsByRiskMeterId---------DONE")
# result = myKenna.findAssetsByRiskMeterId(240258)
# print(len(result))
# print(result)

print("---------updateAssetPriorities---------DONE")
# assets = [379962, 21169]
# result = myKenna.updateAssetPriorities(assets, 8)
# print(result)



