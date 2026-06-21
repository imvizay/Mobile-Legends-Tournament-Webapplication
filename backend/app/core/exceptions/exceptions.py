class AppException(Exception):
    pass


# USER REGISTRATION EXCEPTION
class UserAlreadyExistsError(AppException):
    pass

class PendingRegistrationExistsError(AppException):
    pass

class UserNotFoundException(AppException):
    pass

class UserBannedException(AppException):
    pass

# TOKEN EXCEPTIONS
class InvalidTokenException(AppException):
    pass

class TokenExpiredException(AppException):
    pass

class InvalidSessionException(AppException):
    pass

class RevokedTokenException(AppException):
    pass


# TEAM EXCEPTIONS
class ExceptionPlayerAlreadyHasTeam(AppException):
    pass

class ExceptionTeamAlreadyExits(AppException):
    pass

class NoTeamException(AppException):
    pass