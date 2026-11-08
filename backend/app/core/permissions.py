from enum import Enum


class Role(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    EDITOR = "editor"


ROLE_HIERARCHY = {
    Role.SUPER_ADMIN: 3,
    Role.ADMIN: 2,
    Role.EDITOR: 1,
}


def has_minimum_role(user_role: str, required_role: Role) -> bool:
    user_level = ROLE_HIERARCHY.get(user_role, 0)
    required_level = ROLE_HIERARCHY.get(required_role, 999)
    return user_level >= required_level

