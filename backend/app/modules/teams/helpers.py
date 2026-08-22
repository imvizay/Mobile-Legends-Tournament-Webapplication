from .schemas import (
    TeamRegisteredTournament,
    TeamMembers,
    TeamRosterPlayer,
    RosterPlayer,
)
from datetime import datetime, timezone


def make_roster_player_response(roster_players):

    if not roster_players:
        return None
    
    

    return TeamRosterPlayer(
        roster_status=roster_players[0].roster.status.value,
        is_roster_locked=roster_players[0].roster.status.value == "confirmed",
        roster_players=[
            RosterPlayer(
                id=rp.player.id,
                mlbb_id=rp.player.mlbb_id,
                mlbb_server=rp.player.mlbb_server,
                role=rp.player.role,
                tournament_readiness=rp.tournament_readiness,
                status=rp.status,
            )
            for rp in roster_players
        ],
    )


def make_recent_most_tournament_roster_response(
    registration,
    roster_players=None,
):

    tournament = registration.tournament

    roster_response = make_roster_player_response(roster_players)

    return TeamRegisteredTournament(
        tournament_id=tournament.id,
        tournament_name=tournament.tournament_name,
        server=tournament.server,
        prize_pool=tournament.prize_pool,
        entry_fee=tournament.entry_fee,
        max_teams=tournament.max_teams,
        registration_opens_at=tournament.registration_opens_at,
        registration_closes_at=tournament.registration_closes_at,
        starts_at=tournament.starts_at,
        ends_at=tournament.ends_at,
        status=registration.status.value,
        applied_at=registration.applied_at,
        roster=roster_response,
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
        registration_opens_at=tournament.registration_opens_at,
        registration_closes_at=tournament.registration_closes_at,
        
        starts_at=tournament.starts_at,
        ends_at=tournament.ends_at,
        status=registration.status.value,
        applied_at=registration.applied_at,
    )


def make_member_response(member):
    return TeamMembers(
        id=member.player.id,
        email=member.player.email,
        mlbb_id=member.player.mlbb_id,
        mlbb_server=member.player.mlbb_server,
        role=member.role,
        status=member.status,
    )
