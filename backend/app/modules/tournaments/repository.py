from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from .models import Tournament


class TournamentRepository:

    def __init__(self, db: AsyncSession):
        self.db = db
        
    def check_tournament_name(self,tournament_name:str):
        return (
            self.db.query(Tournament).
            filter(Tournament.tournament_name == tournament_name).first() is not None
        )
        
    def load_tournaments(self):
        return ( 
                self.db.query(Tournament).
                all() 
        )
           

    def create_tournament(self, tournament_data: dict):

        background_image = tournament_data.get("background_image")

        banner_image = tournament_data.get("banner_image")

        db_data = {
            key: value
            for key, value in tournament_data.items()
            if key
            not in {
                "background_image",
                "banner_image",
            }
        }

        tournament = Tournament(
            **db_data,
            background_image_url=(
                background_image.get("url") if background_image else None
            ),
            background_image_public_id=(
                background_image.get("public_id") if background_image else None
            ),
            banner_image_url=(banner_image.get("url") if banner_image else None),
            banner_image_public_id=(banner_image.get("public_id") if banner_image else None),
        )

        self.db.add(tournament)

        self.db.commit()
        self.db.refresh(tournament)

        return tournament


    def publish_tournament(self,tournament_id:int):
        
        tournament = (
            self.db.query(Tournament).
            filter(Tournament.id == tournament_id)
            .first()
        )
        
        if not tournament:
            raise HTTPException(
                status_code=404,
                detail="Tournament not found."
            )
        
        if tournament.visibility_status == "published":
            raise HTTPException(
                status_code=400,
                detail="Tournament already published"
            )
            
        tournament.visibility_status = "published"
        
        self.db.commit()
        self.db.refresh(tournament)
        
        return tournament