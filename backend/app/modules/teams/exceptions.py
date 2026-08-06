from ...core.exceptions.exceptions import AppException


# Team Exceptions
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