import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

class CloudinaryService:
   
    def upload_image(self,file:UploadFile,folder:str):
        if file is None:
            return None
        
        result = cloudinary.uploader.upload(
            file=file.file,
            folder=folder,
            resource_type='image'
        )

        return {
            "public_id": result["public_id"],       
            "secure_url": result["secure_url"],     
        }

    
    def replace_image(self,new_file,old_file_id,folder):

        uploaded = self.upload_image(new_file,folder)
        self.delete_image(old_file_id)

        return uploaded
    

    def delete_image(self,public_id: str):

        return cloudinary.uploader.destroy(
            public_id,
            resource_type="image",
        )

   

cloud_service = CloudinaryService()