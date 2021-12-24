import smtplib, sys

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


class Smtp():
    def __init__(self):
        super().__init__()
    
    def sendEmail(self, payload, sender, receivers_to, receivers_cc, subject):
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] = receivers_to
        msg['Cc'] = receivers_cc
        msg_part = MIMEText(payload, 'html')
        msg.attach(msg_part)
        #sending...
        try:
            s = smtplib.SMTP('localhost')
            s.sendmail(sender, str(receivers_to), msg.as_string())
            print("Message has been sent successfully...")
        except Exception as e:
            print(e)
            print("Error while sending message...")
            sys.exit()