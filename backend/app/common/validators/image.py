from fastapi import HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError

MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024


def validate_image(file: UploadFile | None) -> None:
    if file is None:
        return

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size must not exceed 5 MB.",
        )

    try:
        image = Image.open(file.file)
        image.verify()
    except UnidentifiedImageError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unsupported image.",
        ) from exc
    finally:
        file.file.seek(0)
