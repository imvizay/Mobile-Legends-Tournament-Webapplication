"""created pending registration table

Revision ID: fff3acfe35de
Revises: 18fa602c9135
Create Date: 2026-06-06 23:00:58.592170

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fff3acfe35de'
down_revision: Union[str, Sequence[str], None] = '18fa602c9135'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
