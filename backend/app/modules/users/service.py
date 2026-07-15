from app.modules.auth.models import Player
from .repository import UserRepository, PlayerDashboardRepository
from .schema import AdminUsersResponse, UsersList


class UserService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def get_users(self, current_user):

        users = self.repository.get_all_users(current_user)

        return AdminUsersResponse(success=True, message="Done.", data=users)



# Player Dashboard
from .schema import PlayerDashboardResponse ,PlayerDashboardData

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
