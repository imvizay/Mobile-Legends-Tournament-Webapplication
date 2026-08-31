from .schemas import (
    TeamRegisteredTournament,
    TeamMembers,
    TeamRosterPlayer,
    RosterPlayer,
)
from datetime import datetime, timezone


def make_roster_player_response(roster_player):

    if not roster_player:
        return None

    return TeamRosterPlayer(
        
        is_roster_locked=roster_player[0].roster.status,
        roster_players=[
            RosterPlayer(
                id=roster.player.id,
                mlbb_id=None,
                mlbb_server=None,
                tournament_readiness=roster.tournament_readiness,
                status=roster.status,
            )
            for roster in roster_player
        ],
    )


def make_recent_most_tournament_roster_response(registration, roster_players=None):

    tournament = registration.tournament

    roster_players = make_roster_player_response(roster_players)

    return TeamRegisteredTournament(
        tournament_id=tournament.id,
        tournament_name=tournament.tournament_name,
        server=tournament.server,
        prize_pool=(
            tournament.prize_pool if tournament.prize_pool is not None else None
        ),
        entry_fee=tournament.entry_fee,
        max_teams=tournament.max_teams,
        registration_open_date=datetime.combine(
            tournament.reg_open_date,
            tournament.reg_open_time,
        ).replace(tzinfo=timezone.utc),
        registration_end_date=datetime.combine(
            tournament.reg_close_date,
            tournament.reg_close_time,
        ).replace(tzinfo=timezone.utc),
        tournament_start_date=datetime.combine(
            tournament.tournament_start_date,
            tournament.tournament_start_time,
        ).replace(tzinfo=timezone.utc),
        tournament_end_date=datetime.combine(
            tournament.tournament_end_date,
            tournament.tournament_end_time,
        ).replace(tzinfo=timezone.utc),
        status=registration.status.value,
        applied_at=registration.applied_at,
        roster=roster_players,
    )


def make_tournament_response(registration):

    tournament = registration.tournament
    return TeamRegisteredTournament(
        tournament_id=tournament.id,
        tournament_name=tournament.tournament_name,
        server=tournament.server,
        prize_pool=(
            tournament.prize_pool if tournament.prize_pool is not None else None
        ),
        entry_fee=tournament.entry_fee,
        max_teams=tournament.max_teams,
        registration_open_date=datetime.combine(
            tournament.reg_open_date,
            tournament.reg_open_time,
        ).replace(tzinfo=timezone.utc),
        registration_end_date=datetime.combine(
            tournament.reg_close_date,
            tournament.reg_close_time,
        ).replace(tzinfo=timezone.utc),
        tournament_start_date=datetime.combine(
            tournament.tournament_start_date,
            tournament.tournament_start_time,
        ).replace(tzinfo=timezone.utc),
        tournament_end_date=datetime.combine(
            tournament.tournament_end_date,
            tournament.tournament_end_time,
        ).replace(tzinfo=timezone.utc),
        status=registration.status.value,
        applied_at=registration.applied_at,
    )


def make_member_response(member):
    return TeamMembers(
        id=member.player.id,
        email=member.player.email,
        role=member.role,
        status=member.status,
    )
