from fastapi import HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB

def validate_image(file: UploadFile | None) -> None:
    if file is None:
        return

    # Validate file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size must not exceed 5 MB."
        )

    # Validate that it is a real image
    try:
        image = Image.open(file.file)
        image.verify()
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unsupported image."
        )
    finally:
        file.file.seek(0)


def validate_user_eligibility(current_user):
    pass