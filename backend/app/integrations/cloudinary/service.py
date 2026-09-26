from fastapi import UploadFile

from .client import cloudinary_client


class CloudinaryService:
    def upload_image(self, file: UploadFile, folder: str):
        if file is None:
            return None

        result = cloudinary_client.uploader.upload(
            file.file,
            folder=folder,
            resource_type="image",
        )

        return {
            "public_id": result["public_id"],
            "secure_url": result["secure_url"],
        }

    def replace_image(
        self,
        new_file: UploadFile,
        old_file_id: str | None,
        folder: str,
    ):
        uploaded = self.upload_image(new_file, folder)

        if old_file_id:
            self.delete_image(old_file_id)

        return uploaded

    def delete_image(self, public_id: str | None):
        if not public_id:
            return None

        return cloudinary_client.uploader.destroy(
            public_id,
            resource_type="image",
        )


cloudinary_service = CloudinaryService()
