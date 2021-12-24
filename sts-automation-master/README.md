# STS Automation Scripts

In this repository there are number of scripts related to vulneraility management proccess. In our vulnerability management process we use a control plane application to manage all vulnerabilities. The tool is called Kenna. 

# Tracking Service Ticket Ststus in Kenna

Please visit https://atlassian/confluence/display/SEC/STS+Service+Automation for detailed information

| Name | Script Name | Status |
| ---- | ----------- | ------ |
| CRVM Tracker | jira-kenna-tracker.py | COMPLETED |
| CRVM Tickets - Waiting for Confirmation | jira-waiting-for-confirmation.py | COMPLETED | 
| Notify assignees in Jira | jira-commenter.py | IN PROGRESS |
| Adding Desktop Users into Kenna | ssrs-kenna-desktop-owners.py | IN PROGRESS | 
| Jira to Kenna Integration | jira-kenna-pentest-connector.py | IN PROGRESS |
| Generate a weekly report for SRT call. | srt-report.py | IN PROGRESS |
| Update Jira Tickets | jira-assignee-update.py | IN PROGRESS |
| Kenna user report | kenna-user-report.py | COMPLETED |
| Kenna asset priorities | kenna-update-asset-priorities.py | COMPLETED |
| Kenna vulnerability scores | kenna-update-vulnerability-score.py | COMPLETED |
| Kenna tag alignment | kenna-tag-alignment.py | IN PROGRESS |

-------------------------

# Cronjob checklist

- [X] CRVM Tracker
- [X] CRVM Tickets - Waiting for Confirmation 
- [ ] Notify assignees in Jira #
- [ ] Adding Desktop Users into Kenna ?? 
- [ ] Jira to Kenna Integration # 
- [ ] Update Jira Tickets 
- [X] Kenna user report 
- [X] Kenna asset priorities 
- [X] Kenna vulnerability scores 
- [X] Kenna tag alignment 

