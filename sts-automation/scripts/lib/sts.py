import json, requests, sys
import sqlite3, re, urllib3, os
import flask
from flask import render_template
from requests.auth import HTTPBasicAuth

import smtplib
import pdfkit

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def sendReport(subject, payload, sender="FROM:", receiver="TO:"):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = receiver
    msg_part = MIMEText(payload, 'html')
    msg.attach(msg_part)
    
    #sending...
    try:
        s = smtplib.SMTP('localhost')
        s.sendmail(sender, str(receiver), msg.as_string())
        print("Message has been sent successfully...")
    except Exception as e:
        print(e)
        print("Error while sending message...")
    finally:
        s.quit() 

def createPdfReport(data, template_filename):
    #todo: complete this  
    pass