# Azure-Kenna Connection

Kenna security platform doesn't have a native integration with the Azure cloud. So we cannot see the Azure security issues or vulnerabilities in Kenna dashboard. So I created a simple script that pulls the security issues from Azure Security Center (ASC) and then push them to Kenna by using rest API.