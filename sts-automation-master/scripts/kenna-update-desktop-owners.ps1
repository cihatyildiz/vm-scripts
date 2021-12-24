$creds = Get-Credential

$SQLCode = "select  vrs.Name0 as [Machine Name],
vru.Full_User_Name0 as [User Name], 
vru.Unique_User_Name0 AS [UserID]
from [cm_pri].[dbo].[v_R_User] vru
left join [cm_pri].[dbo].[v_UsersPrimaryMachines] upm on upm.UserResourceID = vru.ResourceID
left join [cm_pri].[dbo].[v_R_System] vrs on upm.MachineID = vrs.ResourceID
left join [cm_pri].[dbo].[v_GS_COMPUTER_SYSTEM] vgscs on vrs.ResourceID = vgscs.ResourceID
--where vru.manager0 LIKE '%' + @manager + '%' OR vru.Full_User_Name0 = @manager AND vru.Unique_User_Name0 like 'delta%\%'
where vrs.Name0 IN (select Name from [CM_PRI].[dbo].[CollectionMembers]
Where SiteID = (Select SiteID from [CM_PRI].[dbo].[Collections_G]
WHERE CollectionName = 'Windows x64 Client Systems'))"
 
$results = Invoke-Sqlcmd -Query $SQLCode -Server "SACSQLMGT100.deltads.ent\CM2012_PRI,49715" -Database "CM_PRI" -Credential $creds
$results | Export-Csv c:\temp\desktopusers.csv