import pymssql

PASS = "!@#Iseeeverything"

conn = pymssql.connect(
    server="SACSQLDBA002",
    user=r'DELTADS\ENT_SVC_PJEagleEye',
    database="Documentation",
    password=  PASS
    )
count = 0
cursor = conn.cursor()
#cursor.execute("SELECT * FROM dbo.vAssetApplications WHERE Environment LIKE 'LAB'")
#cursor.execute("SELECT * FROM dbo.vAssetApplications")
cursor.execute("SELECT * FROM dbo.vAssetApplications")
row = cursor.fetchone()
filex = open("list.data","w+")
row = cursor.fetchone()

print(row)
while row:  
    print(row)
    row = cursor.fetchone()
    filex.writelines(str(row) + "\n")
    count += 1

filex.close()
conn.commit()
conn.close()
print(str(count))