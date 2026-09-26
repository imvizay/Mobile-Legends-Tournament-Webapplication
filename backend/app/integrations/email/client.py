import resend

from app.core.config.settings import settings

resend.api_key = settings.RESEND_API_KEY
email_client = resend
