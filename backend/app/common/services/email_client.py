# Email client for deployment.
# will configured later
from app.core.config import settings
import resend

resend.api_key = settings.settings.RESEND_API_KEY

client = resend