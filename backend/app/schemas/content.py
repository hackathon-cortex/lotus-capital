from typing import List, Optional
from pydantic import BaseModel

class StatisticSchema(BaseModel):
    id: str
    label: str
    value: str
    displayText: str
    unit: Optional[str] = None
    tier: str
    asOfDate: Optional[str] = None
    definitionNote: Optional[str] = None
    sourceDocument: str
    approvalStatus: str
    pages: List[str]

class RegistrationSchema(BaseModel):
    id: str
    clientEntry: str
    number: str
    holder: str
    role: str
    recommendedWording: str
    verifyBeforePublishing: str
    validityDate: Optional[str] = None
    status: str

class PartnerSchema(BaseModel):
    id: str
    name: str
    category: str
    relationshipLabel: str
    logoPlaceholder: str
    status: str

class TeamMemberSchema(BaseModel):
    id: str
    name: str
    designation: str
    credentials: str
    bio: str
    photoPath: str
    approvalStatus: str

class AchievementSchema(BaseModel):
    id: str
    year: int
    award: str
    issuedBy: str
    status: str
