"""redesinged he tournament model 

Revision ID: 802aa9a1d83d
Revises: 9de63df455e6
Create Date: 2026-09-06 15:51:03.350634

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '802aa9a1d83d'
down_revision: Union[str, Sequence[str], None] = '9de63df455e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("tournaments", sa.Column("registration_opens_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("tournaments", sa.Column("registration_closes_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("tournaments", sa.Column("starts_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("tournaments", sa.Column("ends_at", sa.DateTime(timezone=True), nullable=True))

    op.execute("""
        UPDATE tournaments
        SET
            registration_opens_at = reg_open_date + reg_open_time,
            registration_closes_at = reg_close_date + reg_close_time,
            starts_at = tournament_start_date + tournament_start_time,
            ends_at = tournament_end_date + tournament_end_time
    """)

    op.alter_column("tournaments", "registration_opens_at", nullable=False)
    op.alter_column("tournaments", "registration_closes_at", nullable=False)
    op.alter_column("tournaments", "starts_at", nullable=False)
    op.alter_column("tournaments", "ends_at", nullable=False)

    op.drop_column("tournaments", "reg_open_date")
    op.drop_column("tournaments", "reg_open_time")
    op.drop_column("tournaments", "reg_close_date")
    op.drop_column("tournaments", "reg_close_time")
    op.drop_column("tournaments", "tournament_start_date")
    op.drop_column("tournaments", "tournament_start_time")
    op.drop_column("tournaments", "tournament_end_date")
    op.drop_column("tournaments", "tournament_end_time")

def downgrade():
    op.add_column("tournaments", sa.Column("reg_open_date", sa.Date(), nullable=True))
    op.add_column("tournaments", sa.Column("reg_open_time", sa.Time(), nullable=True))
    op.add_column("tournaments", sa.Column("reg_close_date", sa.Date(), nullable=True))
    op.add_column("tournaments", sa.Column("reg_close_time", sa.Time(), nullable=True))
    op.add_column("tournaments", sa.Column("tournament_start_date", sa.Date(), nullable=True))
    op.add_column("tournaments", sa.Column("tournament_start_time", sa.Time(), nullable=True))
    op.add_column("tournaments", sa.Column("tournament_end_date", sa.Date(), nullable=True))
    op.add_column("tournaments", sa.Column("tournament_end_time", sa.Time(), nullable=True))

    op.execute("""
        UPDATE tournaments
        SET
            reg_open_date = registration_opens_at::date,
            reg_open_time = registration_opens_at::time,
            reg_close_date = registration_closes_at::date,
            reg_close_time = registration_closes_at::time,
            tournament_start_date = starts_at::date,
            tournament_start_time = starts_at::time,
            tournament_end_date = ends_at::date,
            tournament_end_time = ends_at::time
    """)

    op.drop_column("tournaments", "registration_opens_at")
    op.drop_column("tournaments", "registration_closes_at")
    op.drop_column("tournaments", "starts_at")
    op.drop_column("tournaments", "ends_at")