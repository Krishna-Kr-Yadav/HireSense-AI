# Database Schema

## User Collection

{
    _id,
    name,
    email,
    password,
    createdAt
}

## Resume Collection

{
    _id,
    userId,
    resumeUrl,
    uploadedAt
}

## Analysis Collection

{
    _id,
    userId,
    resumeId,
    score,
    missingSkills,
    suggestions,
    createdAt
}