from .schemas import (
    TeamRegisteredTournament,
    TeamMembers,
    TeamRosterPlayer,
    RosterPlayer,
    TournamentImages,
    TournamentTimeline,
    TournamentEligibility,
    TournamentStatusInfo,
)


def make_roster_player_response(roster_players):
    if not roster_players:
        return None

    roster = roster_players[0].roster

    return TeamRosterPlayer(
        roster_status=roster.status.value if roster.status else None,
        is_roster_locked=roster.status.value == "confirmed" if roster.status else False,
        roster_players=[
            RosterPlayer(
                id=rp.player.id,
                mlbb_id=rp.player.mlbb_id,
                mlbb_server=rp.player.mlbb_server,
                account_level=getattr(rp.player, "account_level", None),
                rank=getattr(rp.player, "rank", None),
                role=rp.player.role,
                tournament_readiness=rp.tournament_readiness,
                status=rp.status.value if rp.status else None,
                fee_status=(
                    rp.contribution.status.value
                    if rp.contribution and rp.contribution.status
                    else None
                ),
            )
            for rp in roster_players
        ],
    )


def make_recent_most_tournament_roster_response(registration, roster_players=None):
    tournament = registration.tournament
    roster_response = make_roster_player_response(roster_players)

    return TeamRegisteredTournament(
        tournament_id=tournament.id,
        tournament_name=tournament.tournament_name,
        game_name=tournament.game_name,
        tournament_type=tournament.tournament_type,
        team_format=tournament.team_format,
        min_teams=tournament.min_teams,
        max_teams=tournament.max_teams,
        description=tournament.description,
        server=tournament.server,
        category=tournament.category,
        competition_type=tournament.competition_type,
        bracket_format=tournament.bracket_format,
        seeding_method=tournament.seeding_method,
        entry_fee=tournament.entry_fee,
        entry_type=tournament.entry_type,
        prize_pool=tournament.prize_pool,
        platform_fee=tournament.platform_fee,
        winner_share=tournament.winner_share,
        runner_up_share=tournament.runner_up_share,
        eligibility=TournamentEligibility(
            minimum_account_level=tournament.minimum_account_level,
            minimum_rank=tournament.minimum_rank,
            registration_access=tournament.registration_access,
            registration_approval=tournament.registration_approval,
        ),
        images=TournamentImages(
            background_url=tournament.background_image_url,
            banner_url=tournament.banner_image_url,
        ),
        timeline=TournamentTimeline(
            registration_opens_at=tournament.registration_opens_at,
            registration_closes_at=tournament.registration_closes_at,
            registration_extended_at=tournament.registration_extended_at,
            starts_at=tournament.starts_at,
            ends_at=tournament.ends_at,
        ),
        status=TournamentStatusInfo(
            status=tournament.status if tournament.status else None,
            registration_status=(
                tournament.registration_status
                if tournament.registration_status
                else None
            ),
            visibility_status=(
                tournament.visibility_status
                if tournament.visibility_status
                else None
            ),
            bracket_status=(
                tournament.bracket_status if tournament.bracket_status else None
            ),
            registration_extension_reason=tournament.registration_extension_reason,
            postponement_reason=tournament.postponement_reason,
            cancellation_reason=tournament.cancellation_reason,
            registration_extended_at=tournament.registration_extended_at,
            postponed_at=tournament.postponed_at,
            cancelled_at=tournament.cancelled_at,
        ),
        registration_id=registration.id,
        applied_at=registration.applied_at,
        registration_status_for_team=(
            registration.status.value if registration.status else None
        ),
        roster=roster_response,
    )


def make_tournament_response(registration):
    return make_recent_most_tournament_roster_response(
        registration=registration,
        roster_players=None,
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
