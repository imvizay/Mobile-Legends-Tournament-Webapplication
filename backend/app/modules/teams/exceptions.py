from app.core.exceptions.exceptions import AppException


class PlayerAlreadyHasTeamError(AppException):
    pass


class TeamAlreadyExistsError(AppException):
    pass


class NoTeamError(AppException):
    pass


class UserIsBlockedOrInactive(AppException):
    pass

class UserInTeam(AppException):
    pass

class TeamFullException(AppException):
    pass

class TeamNotFound(AppException):
    pass

class PendingApplicationException(AppException):
    pass

class MaximumJoinRequestException(AppException):
    pass