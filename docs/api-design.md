# API Design

## Authentication

### POST /api/auth/register

Description:
Register a new user

Authentication:
Not Required

Request Body:

{
    "name": "Krishna",
    "email" : "abc@gmail.com",
    "password" : "12345"
}

Validation:
- name: required
- eamil: required, unique
- password: minimum 6 characters

Status Code:
- 201 Created
- 400 Bad Request
- 409 Conflict

Response:

Success Response (201 Created)
{
    "success" : true,
    "message" : "User Registered successfully",
    "user" : {
        "_id" : "1",
        "name" : "Krishna Yadav",
        "email" : "abc@gmail.com"
    },
    "token" : "jwt_token_here"
}

Error Response(400)
{
    "success" : false,
    "message" : "Email already exists"
}

--------------------------------------------

### POST /api/auth/login

Description: 
Authenticat an existing user.

Authentication:
Not Required

Request Body:

{
    "email" : "abc@gmail.com",
    "password" : "12345"
}

Validation:
- email: required
- password: required

Status Codes: 
- 200 OK
- 400 Bad Request
- 401 Unauthorized
- 500 Internal Server Error

Success Response(200):
{
    "success" : true,
    "message" : "Login successfully",
    "user" : {
        "_id" : "1",
        "name" : "Krishna Yadav",
        "email" : "abc@gmail.com"
    }
    "token" : "jwt_token_here"
}

Error Response(401):
{
    "success" : false,
    "message" : "Invalid email or password"
}

--------------------------------------------------

### POST /api/auth/logout

--------------------------------------------------
### POST/api/auth/me

---------------------------------------------------

## User

### GET /api/users/profile

---------------------------------------------------
### PUT /api/users/profile

---------------------------------------------------

## Resume 

### 
