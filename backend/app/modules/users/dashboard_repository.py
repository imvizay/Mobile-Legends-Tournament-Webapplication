from app.modules.tournaments.models import Tournament


class PlayerDashboardRepository:

    def __init__(self, db):
        self.db = db

    def get_tournaments(self):
        return self.db.query(Tournament).filter(
            Tournament.visibility_status == "published"
        )

    def upcoming_tournaments(self):
        return self.db.query(Tournament).filter(
            Tournament.visibility_status != "published"
        )





