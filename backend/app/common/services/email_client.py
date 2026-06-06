# Email client for deployment.
# will configured later
import os 

MAIL_FROM=os.getenv("MAIL_FROM")
MAILTRAP_API_TOKEN = os.getenv("MAILTRAP_API_TOKEN")