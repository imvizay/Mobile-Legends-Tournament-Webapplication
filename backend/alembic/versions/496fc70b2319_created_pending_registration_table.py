"""created pending registration table

Revision ID: 496fc70b2319
Revises: fff3acfe35de
Create Date: 2026-06-06 23:02:47.068704

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '496fc70b2319'
down_revision: Union[str, Sequence[str], None] = 'fff3acfe35de'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
