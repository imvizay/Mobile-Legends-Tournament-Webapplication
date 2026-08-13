"""updated team_contribution_table status from default to server_default.

Revision ID: 94de17cc587b
Revises: ed95ecf7c889
Create Date: 2026-09-01 11:56:09.510947

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '94de17cc587b'
down_revision: Union[str, Sequence[str], None] = 'ed95ecf7c889'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None
def upgrade() -> None:
    status_enum = postgresql.ENUM(
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
        name="teamtournamentcontributionstatus",
    )

    status_enum.create(op.get_bind(), checkfirst=True)

    op.add_column(
        "team_tournament_contribution",
        sa.Column(
            "status",
            status_enum,
            nullable=False,
            server_default="PENDING",
        ),
    )


def downgrade() -> None:
    op.drop_column(
        "team_tournament_contribution",
        "status",
    )

    status_enum = postgresql.ENUM(
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
        name="teamtournamentcontributionstatus",
    )

    status_enum.drop(op.get_bind(), checkfirst=True)
