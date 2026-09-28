from .repository import UserRepository
from .schemas import AdminUsersResponse


class UserService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def get_users(self, current_user):

        users = self.repository.get_all_users(current_user)

        return AdminUsersResponse(success=True, message="Done.", data=users)

