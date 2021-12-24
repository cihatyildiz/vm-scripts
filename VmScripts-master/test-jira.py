from libs import jira
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

jira_server = "https://atlassian/jira"
jira_query = "reporter=ENT_SVC_KENNAJIRA AND status != Done"
jira_ticket = "CRVM-888"
xira = jira.Jira(jira_server, username, password)

# Get issue details 
issue = xira.getTicketInformation(jira_ticket)
print("---- Issue ----")
print(issue)

# Get issues 
issues = xira.searchJiraTickets(jira_query)
print("---- Issues ----")
for x in results:
    print(x)

# Create A Ticket
# issue = xira.createTicket()
