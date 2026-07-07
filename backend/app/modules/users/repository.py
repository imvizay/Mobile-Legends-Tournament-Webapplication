from app.modules.auth.models import Player

class UserRepository:
    
    def __init__(self,db):
        self.db = db
        
    def get_all_users(self,current_user):
        
        records = (
            self.db.query(Player).
            filter(Player.id != current_user.id)
            .order_by(Player.id.desc())
        ) 
        
        return records
        
    