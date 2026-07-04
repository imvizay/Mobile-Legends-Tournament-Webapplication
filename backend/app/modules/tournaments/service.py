from fastapi import UploadFile
from app.modules.auth.models import Player
from .schema import TournamentForm

from ...core.cloudinary.cloudinary_services import cloud_service
from .validators import validate_image
from pprint import pprint

class TournamentService:

    def __init__(self, repository):
        self.repository = repository

    async def create_tournament(
        self,
        admin: Player,
        validated_data: TournamentForm,
        background_image: UploadFile | None,
        banner_image: UploadFile | None,
    ):
        
        # return early if tournament_name is already in db
        tournament_name = validated_data.get("tournament_name", None)
        
        if tournament_name:
            exists = self.repository.check_tournament_name(tournament_name)
            if exists:
                return {
                    "success": False,
                    "status": 400,
                    "message": "Tournament name already exists."
                }

        images = {
            "background_image": background_image,
            "banner_image": banner_image
        }

        image_data = {}

        for key, value in images.items():

            if not value:
                continue

            validate_image(value)
            
            # upload cloudinary
            result = cloud_service.upload_image(
                value, folder=f"tournament/{key}"
            )
            
            image_data[key] = {
                "public_id":result["public_id"],
                "url":result["secure_url"]
            }

        tournament_data = validated_data.model_dump()
        
        tournament_data.update(image_data)
        
        tournament_data["created_by"] = admin.id
        
        created_tournament = self.repository.create_tournament(tournament_data)
        
        return {
            "success":True,
            "status":201,
            "message":f"Tournament: {created_tournament.tournament_name} created successfully."
        }
        
        
        

    def update_tournament(self, tournament_id, validated_data):
        pass

    def publish_tournament(self, tournament_id):
        pass

    def cancel_tournament(self, tournament_id):
        pass
