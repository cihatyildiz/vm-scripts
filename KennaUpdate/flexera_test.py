import pymssql

PASS = "!@#Iseeeverything"

conn = pymssql.connect(
    server="<db-server>",
    user=r'<domain-user>',
    database="Documentation",
    password=  PASS
    )
count = 0
cursor = conn.cursor()
ursor.execute("SELECT * FROM <database-view-flexera>")
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