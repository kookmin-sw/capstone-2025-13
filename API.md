# Wuung API Server

> Version v1.0.0

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| PUT | [/quests](#putquests) | Create a new quest |
| POST | [/quests](#postquests) | Update quest progress |
| POST | [/daignosisText/read](#postdaignosistextread) | read diagnosis text list |
| POST | [/daignosis/create](#postdaignosiscreate) |  |
| POST | [/auth/signup](#postauthsignup) | Sign up new user and generate new tokens |
| POST | [/auth/refresh](#postauthrefresh) | Refresh JWT tokens |
| POST | [/auth/logout](#postauthlogout) | Logout user |
| POST | [/auth/login](#postauthlogin) | Authenticate user and generate JWT tokens |
| GET | [/quests/me](#getquestsme) | Get my quests |
| GET | [/auth/me](#getauthme) | Get current user's information |
| GET | [/](#get) |  |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| CreateQuestRequest | [#/components/schemas/CreateQuestRequest](#componentsschemascreatequestrequest) |  |
| ApiResponseDTO | [#/components/schemas/ApiResponseDTO](#componentsschemasapiresponsedto) |  |
| ApiResponseDTOUserQuestsDTO | [#/components/schemas/ApiResponseDTOUserQuestsDTO](#componentsschemasapiresponsedtouserquestsdto) |  |
| UserQuestsDTO | [#/components/schemas/UserQuestsDTO](#componentsschemasuserquestsdto) |  |
| UpdateQuestRequest | [#/components/schemas/UpdateQuestRequest](#componentsschemasupdatequestrequest) |  |
| ReadDiagnosisTextRequest | [#/components/schemas/ReadDiagnosisTextRequest](#componentsschemasreaddiagnosistextrequest) |  |
| ApiResponseDTOListString | [#/components/schemas/ApiResponseDTOListString](#componentsschemasapiresponsedtoliststring) |  |
| CreateDiagnosisRequest | [#/components/schemas/CreateDiagnosisRequest](#componentsschemascreatediagnosisrequest) |  |
| CreateDiagnosisResponse | [#/components/schemas/CreateDiagnosisResponse](#componentsschemascreatediagnosisresponse) |  |
| SignUpRequest | [#/components/schemas/SignUpRequest](#componentsschemassignuprequest) |  |
| ApiResponseDTOSignUpResponse | [#/components/schemas/ApiResponseDTOSignUpResponse](#componentsschemasapiresponsedtosignupresponse) |  |
| SignUpResponse | [#/components/schemas/SignUpResponse](#componentsschemassignupresponse) |  |
| TokenRefreshRequest | [#/components/schemas/TokenRefreshRequest](#componentsschemastokenrefreshrequest) |  |
| ApiResponseDTOTokenRefreshResponse | [#/components/schemas/ApiResponseDTOTokenRefreshResponse](#componentsschemasapiresponsedtotokenrefreshresponse) |  |
| TokenRefreshResponse | [#/components/schemas/TokenRefreshResponse](#componentsschemastokenrefreshresponse) |  |
| LogoutRequest | [#/components/schemas/LogoutRequest](#componentsschemaslogoutrequest) |  |
| ApiResponseDTOString | [#/components/schemas/ApiResponseDTOString](#componentsschemasapiresponsedtostring) |  |
| LoginRequest | [#/components/schemas/LoginRequest](#componentsschemasloginrequest) |  |
| ApiResponseDTOLoginResponse | [#/components/schemas/ApiResponseDTOLoginResponse](#componentsschemasapiresponsedtologinresponse) |  |
| LoginResponse | [#/components/schemas/LoginResponse](#componentsschemasloginresponse) |  |
| ApiResponseDTOListUserQuestsDTO | [#/components/schemas/ApiResponseDTOListUserQuestsDTO](#componentsschemasapiresponsedtolistuserquestsdto) |  |
| ApiResponseDTOUserInfoResponse | [#/components/schemas/ApiResponseDTOUserInfoResponse](#componentsschemasapiresponsedtouserinforesponse) |  |
| UserInfoResponse | [#/components/schemas/UserInfoResponse](#componentsschemasuserinforesponse) |  |
| api token | [#/components/securitySchemes/api token](#componentssecurityschemesapi-token) |  |

## Path Details

***

### [PUT]/quests

- Summary  
Create a new quest

- Description  
Creates a new quest instance for the authenticated user

#### RequestBody

- application/json

```ts
{
  id?: integer
}
```

#### Responses

- 200 Successfully created quest

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    name?: string
    description?: string
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    progress?: integer
    target?: integer
    createdAt?: string
    updatedAt?: string
  }
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

- 404 Quest not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

- 500 Internal server error

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

***

### [POST]/quests

- Summary  
Update quest progress

- Description  
Updates the progress of a quest for the authenticated user

#### RequestBody

- application/json

```ts
{
  id?: string
  current?: integer
}
```

#### Responses

- 200 Successfully updated quest

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    name?: string
    description?: string
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    progress?: integer
    target?: integer
    createdAt?: string
    updatedAt?: string
  }
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

- 404 Quest not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

- 500 Internal server error

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

***

### [POST]/daignosisText/read

- Summary  
read diagnosis text list

- Description  
read diagnosis text list specific type

#### RequestBody

- application/json

```ts
{
  type?: string
}
```

#### Responses

- 200 Successfully read diagnosis text

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data?: string[]
}
```

- 400 Failed to read diagnosis text

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

***

### [POST]/daignosis/create

#### RequestBody

- application/json

```ts
{
  result?: integer
  type?: string
  createAt?: string
}
```

#### Responses

- 200 Successfully create diagnosis

`*/*`

```ts
{
  message?: string
}
```

- 400 Failed to create diagnosis

`application/json`

```ts
{
  message?: string
}
```

- 403 Exception raised while create diagnosis

`application/json`

```ts
{
  message?: string
}
```

***

### [POST]/auth/signup

- Summary  
Sign up new user and generate new tokens

- Description  
Create new user provided credentials with additional fields and generate tokens for access

#### RequestBody

- application/json

```ts
{
  email?: string
  password?: string
  gender?: enum[MALE, FEMALE]
  user_name?: string
  // Birth date in format yyyy-MM-dd
  birth_date?: string
}
```

#### Responses

- 200 sign up user

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    accessToken?: string
    refreshToken?: string
  }
}
```

- 400 sign up failed

`*/*`

```ts
{
  "type": "string"
}
```

***

### [POST]/auth/refresh

- Summary  
Refresh JWT tokens

- Description  
Generates new access and refresh tokens from a valid refresh token.

#### RequestBody

- application/json

```ts
{
  refreshToken?: string
}
```

#### Responses

- 200 Successfully refreshed tokens

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    accessToken?: string
    refreshToken?: string
  }
}
```

- 400 Invalid or expired refresh token

`*/*`

```ts
{
  "type": "string"
}
```

***

### [POST]/auth/logout

- Summary  
Logout user

- Description  
Invalidates refresh tokens for the user.

#### RequestBody

- application/json

```ts
{
  accessToken?: string
  refreshToken?: string
}
```

#### Responses

- 200 Successfully logged out

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data?: string
}
```

- 400 Invalid refresh token

`*/*`

```ts
{
  "type": "string"
}
```

***

### [POST]/auth/login

- Summary  
Authenticate user and generate JWT tokens

- Description  
Validates user credentials and provides access and refresh tokens.

#### RequestBody

- application/json

```ts
{
  email?: string
  password?: string
}
```

#### Responses

- 200 Successfully authenticated

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    accessToken?: string
    refreshToken?: string
  }
}
```

- 400 Bad Request

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

- 401 Invalid credentials

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

***

### [GET]/quests/me

- Summary  
Get my quests

- Description  
Get my quests

#### Parameters(Query)

```ts
// Start date in format yyyy-MM-dd
start?: string
```

#### Responses

- 200 Successfully retrieved quests

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    name?: string
    description?: string
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    progress?: integer
    target?: integer
    createdAt?: string
    updatedAt?: string
  }[]
}
```

- 403 Invalid request

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

- 500 Internal server error

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

***

### [GET]/auth/me

- Summary  
Get current user's information

- Description  
Retrieves the logged-in user's information using a valid access token.

#### Responses

- 200 Successfully retrieved user information

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    email?: string
    roles?: string[]
    username?: string
  }
}
```

- 401 Unauthorized - Invalid or missing access token

`*/*`

```ts
{
  "type": "string"
}
```

***

### [GET]/

#### Responses

- 200 OK

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data?: string
}
```

## References

### #/components/schemas/CreateQuestRequest

```ts
{
  id?: integer
}
```

### #/components/schemas/ApiResponseDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
  }
}
```

### #/components/schemas/ApiResponseDTOUserQuestsDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    name?: string
    description?: string
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    progress?: integer
    target?: integer
    createdAt?: string
    updatedAt?: string
  }
}
```

### #/components/schemas/UserQuestsDTO

```ts
{
  id?: string
  name?: string
  description?: string
  type?: enum[MEDITATE, ACTIVITY, EMOTION]
  progress?: integer
  target?: integer
  createdAt?: string
  updatedAt?: string
}
```

### #/components/schemas/UpdateQuestRequest

```ts
{
  id?: string
  current?: integer
}
```

### #/components/schemas/ReadDiagnosisTextRequest

```ts
{
  type?: string
}
```

### #/components/schemas/ApiResponseDTOListString

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data?: string[]
}
```

### #/components/schemas/CreateDiagnosisRequest

```ts
{
  result?: integer
  type?: string
  createAt?: string
}
```

### #/components/schemas/CreateDiagnosisResponse

```ts
{
  message?: string
}
```

### #/components/schemas/SignUpRequest

```ts
{
  email?: string
  password?: string
  gender?: enum[MALE, FEMALE]
  user_name?: string
  // Birth date in format yyyy-MM-dd
  birth_date?: string
}
```

### #/components/schemas/ApiResponseDTOSignUpResponse

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    accessToken?: string
    refreshToken?: string
  }
}
```

### #/components/schemas/SignUpResponse

```ts
{
  accessToken?: string
  refreshToken?: string
}
```

### #/components/schemas/TokenRefreshRequest

```ts
{
  refreshToken?: string
}
```

### #/components/schemas/ApiResponseDTOTokenRefreshResponse

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    accessToken?: string
    refreshToken?: string
  }
}
```

### #/components/schemas/TokenRefreshResponse

```ts
{
  accessToken?: string
  refreshToken?: string
}
```

### #/components/schemas/LogoutRequest

```ts
{
  accessToken?: string
  refreshToken?: string
}
```

### #/components/schemas/ApiResponseDTOString

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data?: string
}
```

### #/components/schemas/LoginRequest

```ts
{
  email?: string
  password?: string
}
```

### #/components/schemas/ApiResponseDTOLoginResponse

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    accessToken?: string
    refreshToken?: string
  }
}
```

### #/components/schemas/LoginResponse

```ts
{
  accessToken?: string
  refreshToken?: string
}
```

### #/components/schemas/ApiResponseDTOListUserQuestsDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    name?: string
    description?: string
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    progress?: integer
    target?: integer
    createdAt?: string
    updatedAt?: string
  }[]
}
```

### #/components/schemas/ApiResponseDTOUserInfoResponse

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    email?: string
    roles?: string[]
    username?: string
  }
}
```

### #/components/schemas/UserInfoResponse

```ts
{
  email?: string
  roles?: string[]
  username?: string
}
```

### #/components/securitySchemes/api token

```ts
{
  "type": "http",
  "name": "api token",
  "scheme": "bearer"
}
```
