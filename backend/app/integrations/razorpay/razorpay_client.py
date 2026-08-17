import razorpay
from app.core.config.settings import settings

razorpay_client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)


print("RAZORPAY KEY ID:", settings.RAZORPAY_KEY_ID)
print(
    "RAZORPAY SECRET EXISTS:",
    bool(settings.RAZORPAY_KEY_SECRET),
)