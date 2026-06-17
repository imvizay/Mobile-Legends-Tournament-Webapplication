class AppException(Exception):
    pass


class UserAlreadyExistsError(AppException):
    pass

class PendingRegistrationExistsError(AppException):
    pass

class UserNotFoundException(AppException):
    pass

class UserBannedException(AppException):
    pass

class InvalidCredentialsException(AppException):
    pass

class InvalidTokenException(AppException):
    pass


# TEAM EXCEPTIONS
class ExceptionPlayerAlreadyHasTeam(AppException):
    pass

class ExceptionTeamAlreadyExits(AppException):
    pass

