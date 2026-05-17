import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

TO_EMAIL = os.getenv("EMAIL_TO")

def send_email(subject: str, body: str, to_email: str = TO_EMAIL):
    load_dotenv()
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS") # À sécuriser !

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, sender_password)
            server.send_message(msg)
        print(" Email envoyé avec succès.")
    except Exception as e:
        print(f" Échec de l'envoi de l'email : {e}")