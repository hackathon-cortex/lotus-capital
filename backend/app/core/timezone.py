from datetime import datetime, timezone, timedelta
from typing import Tuple

try:
    from zoneinfo import ZoneInfo
    IST = ZoneInfo("Asia/Kolkata")
except Exception:
    IST = timezone(timedelta(hours=5, minutes=30), name="Asia/Kolkata")


def now_ist() -> datetime:
    return datetime.now(IST)


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def to_ist(dt: datetime) -> datetime:
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(IST)


def get_ist_day_bounds(dt: datetime = None) -> Tuple[datetime, datetime]:
    """Given any datetime (default now), returns (start_utc, end_utc) for its full IST day."""
    if dt is None:
        dt = now_ist()
    dt_ist = to_ist(dt)
    start_ist = datetime(dt_ist.year, dt_ist.month, dt_ist.day, 0, 0, 0, tzinfo=IST)
    end_ist = datetime(dt_ist.year, dt_ist.month, dt_ist.day, 23, 59, 59, 999999, tzinfo=IST)
    return start_ist.astimezone(timezone.utc), end_ist.astimezone(timezone.utc)


def get_ist_month_bounds(dt: datetime = None) -> Tuple[datetime, datetime]:
    """Given any datetime (default now), returns (start_utc, end_utc) for its full IST calendar month."""
    if dt is None:
        dt = now_ist()
    dt_ist = to_ist(dt)
    start_ist = datetime(dt_ist.year, dt_ist.month, 1, 0, 0, 0, tzinfo=IST)
    if dt_ist.month == 12:
        end_ist = datetime(dt_ist.year + 1, 1, 1, 0, 0, 0, tzinfo=IST) - timedelta(microseconds=1)
    else:
        end_ist = datetime(dt_ist.year, dt_ist.month + 1, 1, 0, 0, 0, tzinfo=IST) - timedelta(microseconds=1)
    return start_ist.astimezone(timezone.utc), end_ist.astimezone(timezone.utc)

