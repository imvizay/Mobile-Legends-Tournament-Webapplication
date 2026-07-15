from app.modules.auth.models import Player
from typing import Optional


class UserRepository:

    def __init__(self, db):
        self.db = db

    def get_all_users(self, current_user):

        records = (
            self.db.query(Player)
            .filter(Player.id != current_user.id)
            .order_by(Player.id.desc())
        )

        return records


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


    def get_current_brackets(self, tournament: int):
        pass

    def get_current_leadersboard(self, tournament: int):
        pass

    def winner_history(self):
        pass

    def winner_history_leadersboard(self):
        pass
