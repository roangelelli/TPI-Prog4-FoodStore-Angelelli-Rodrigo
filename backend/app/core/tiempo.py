from datetime import datetime, timezone


def ahora() -> datetime:
    # utc sin zona, asi se comporta igual en postgres y sqlite
    return datetime.now(timezone.utc).replace(tzinfo=None)
