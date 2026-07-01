from sqlalchemy.orm import Session
class TeamService:

    def __init__(self,db:Session):
        self.db = db

    def create_team(self,team_data,logo_img,banner_img):

        # validate binary data 
        # validate team data

        # check user validations (valid_user,not blocked,active member)
        # check team existance 
        # check does current user already owns a team
        #  insert team

        # send notification.


        pass

    def invite_members(self):
        pass

    def remove_member(self):
        pass

    def exit_team(self):
        pass

    def transfer_team_ownership(self):
        pass
