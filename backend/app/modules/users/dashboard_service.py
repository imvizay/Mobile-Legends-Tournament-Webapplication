from app.modules.auth.models import Player

from .dashboard_repository import PlayerDashboardRepository
from .schemas import PlayerDashboardData, PlayerDashboardResponse


class PlayerDashboardService:

    def __init__(self, repository: PlayerDashboardRepository):
        self.repository = repository

    def get_dashboard(self, current_user: Player):

        featured_tournaments = self.repository.get_tournaments()

        upcoming_tournaments = self.repository.upcoming_tournaments()

        return PlayerDashboardResponse(
            status="success",
            
            data=PlayerDashboardData(
                featured_tournaments=featured_tournaments,
                upcoming_tournaments=upcoming_tournaments
            )
        )

