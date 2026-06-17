import cloudinary
from app.core.config.settings import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    cloud_key=settings.CLOUDINARY_API_KEY,
    cloud_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)