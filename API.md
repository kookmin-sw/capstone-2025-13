# Wuung API Server

> Version v1.0.0

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| PUT | [/records/create](#putrecordscreate) | Create new record |
| PUT | [/quests](#putquests) | Create a new quest |
| POST | [/quests](#postquests) | Update quest progress |
| PUT | [/daignosis/submit](#putdaignosissubmit) | Submit diagnosis result |
| POST | [/records/modify](#postrecordsmodify) | Modify existing record |
| POST | [/auth/signup](#postauthsignup) | Sign up new user and generate new tokens |
| POST | [/auth/refresh](#postauthrefresh) | Refresh JWT tokens |
| POST | [/auth/logout](#postauthlogout) | Logout user |
| POST | [/auth/login](#postauthlogin) | Authenticate user and generate JWT tokens |
| GET | [/records/me](#getrecordsme) | Get record by date |
| GET | [/quests/me](#getquestsme) | Get my quests |
| GET | [/daignosis/{id}](#getdaignosisid) | Get diagnosis by ID |
| GET | [/daignosis/results](#getdaignosisresults) | Get diagnosis results |
| GET | [/daignosis/list](#getdaignosislist) | Get all diagnosis list |
| GET | [/auth/me](#getauthme) | Get current user's information |
| GET | [/](#get) |  |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| CreateRecordRequest | [#/components/schemas/CreateRecordRequest](#componentsschemascreaterecordrequest) |  |
| ApiResponseDTO | [#/components/schemas/ApiResponseDTO](#componentsschemasapiresponsedto) |  |
| ApiResponseDTORecordDTO | [#/components/schemas/ApiResponseDTORecordDTO](#componentsschemasapiresponsedtorecorddto) |  |
| RecordDTO | [#/components/schemas/RecordDTO](#componentsschemasrecorddto) |  |
| CreateQuestRequest | [#/components/schemas/CreateQuestRequest](#componentsschemascreatequestrequest) |  |
| ApiResponseDTOUserQuestsDTO | [#/components/schemas/ApiResponseDTOUserQuestsDTO](#componentsschemasapiresponsedtouserquestsdto) |  |
| UserQuestsDTO | [#/components/schemas/UserQuestsDTO](#componentsschemasuserquestsdto) |  |
| DiagnosisResultSubmitRequest | [#/components/schemas/DiagnosisResultSubmitRequest](#componentsschemasdiagnosisresultsubmitrequest) |  |
| ApiResponseDTODiagnosisResultDTO | [#/components/schemas/ApiResponseDTODiagnosisResultDTO](#componentsschemasapiresponsedtodiagnosisresultdto) |  |
| DiagnosisResultDTO | [#/components/schemas/DiagnosisResultDTO](#componentsschemasdiagnosisresultdto) |  |
| RecordUpdateRequest | [#/components/schemas/RecordUpdateRequest](#componentsschemasrecordupdaterequest) |  |
| UpdateQuestRequest | [#/components/schemas/UpdateQuestRequest](#componentsschemasupdatequestrequest) |  |
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
| ApiResponseDTODiagnosisDTO | [#/components/schemas/ApiResponseDTODiagnosisDTO](#componentsschemasapiresponsedtodiagnosisdto) |  |
| DiagnosisDTO | [#/components/schemas/DiagnosisDTO](#componentsschemasdiagnosisdto) |  |
| DiagnosisQuestionDTO | [#/components/schemas/DiagnosisQuestionDTO](#componentsschemasdiagnosisquestiondto) |  |
| DiagnosisScaleDTO | [#/components/schemas/DiagnosisScaleDTO](#componentsschemasdiagnosisscaledto) |  |
| DiagnosisTextDTO | [#/components/schemas/DiagnosisTextDTO](#componentsschemasdiagnosistextdto) |  |
| ApiResponseDTOListDiagnosisResultDTO | [#/components/schemas/ApiResponseDTOListDiagnosisResultDTO](#componentsschemasapiresponsedtolistdiagnosisresultdto) |  |
| ApiResponseDTOListDiagnosisDTO | [#/components/schemas/ApiResponseDTOListDiagnosisDTO](#componentsschemasapiresponsedtolistdiagnosisdto) |  |
| ApiResponseDTOUserInfoResponse | [#/components/schemas/ApiResponseDTOUserInfoResponse](#componentsschemasapiresponsedtouserinforesponse) |  |
| UserInfoResponse | [#/components/schemas/UserInfoResponse](#componentsschemasuserinforesponse) |  |
| api token | [#/components/securitySchemes/api token](#componentssecurityschemesapi-token) |  |

## Path Details

***

### [PUT]/records/create

- Summary  
Create new record

- Description  
Create a new record with rate and data

#### RequestBody

- application/json

```ts
{
  rate?: integer
  data?: string
}
```

#### Responses

- 200 Successfully created record

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    rate?: integer
    data?: string
    createdAt?: string
    updatedAt?: string
  }
}
```

- 403 Unauthorized

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

### [PUT]/daignosis/submit

- Summary  
Submit diagnosis result

- Description  
Submit a new diagnosis result for the authenticated user

#### RequestBody

- application/json

```ts
{
  id?: integer
  result?: integer
  scale?: integer
}
```

#### Responses

- 200 Successfully submitted diagnosis result

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    diagnosisId?: integer
    result?: integer
    scale?: integer
    createdAt?: string
    updatedAt?: string
  }
}
```

- 401 Unauthorized - Invalid or missing JWT token

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

- 404 Diagnosis not found

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

### [POST]/records/modify

- Summary  
Modify existing record

- Description  
Update rate and data of an existing record

#### RequestBody

- application/json

```ts
{
  id?: integer
  rate?: integer
  data?: string
}
```

#### Responses

- 200 Successfully updated record

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

- 403 Unauthorized

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

- 404 Record not found

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

### [GET]/records/me

- Summary  
Get record by date

- Description  
Get a user's record for a specific date

#### Parameters(Query)

```ts
// Date in format yyyy-MM-dd
date: string
```

#### Responses

- 200 Successfully retrieved record

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

- 403 Unauthorized

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

- 404 Record not found

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

### [GET]/daignosis/{id}

- Summary  
Get diagnosis by ID

- Description  
Retrieve diagnosis details for the specified ID

#### Responses

- 200 Successfully retrieved diagnosis

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    type?: enum[Simple, PHQ_9, BDI]
    title?: string
    description?: string
    questions: {
      seq?: integer
      text?: string
      answers: {
        text?: string
        score?: integer
      }[]
    }[]
    scale: {
      start?: integer
      scaleName?: string
      description?: string
    }[]
    createdAt?: string
    updatedAt?: string
  }
}
```

- 401 Unauthorized - Invalid or missing JWT token

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

- 404 Diagnosis not found

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

### [GET]/daignosis/results

- Summary  
Get diagnosis results

- Description  
Retrieve diagnosis results for the authenticated user with optional date filtering

#### Parameters(Query)

```ts
// Start date in format yyyy-MM-dd
start?: string
```

#### Responses

- 200 Successfully retrieved diagnosis results

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    diagnosisId?: integer
    result?: integer
    scale?: integer
    createdAt?: string
    updatedAt?: string
  }[]
}
```

- 401 Unauthorized - Invalid or missing JWT token

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

### [GET]/daignosis/list

- Summary  
Get all diagnosis list

- Description  
Retrieve a list of all available diagnoses

#### Responses

- 200 Successfully retrieved diagnosis list

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    type?: enum[Simple, PHQ_9, BDI]
    title?: string
    description?: string
    questions: {
      seq?: integer
      text?: string
      answers: {
        text?: string
        score?: integer
      }[]
    }[]
    scale: {
      start?: integer
      scaleName?: string
      description?: string
    }[]
    createdAt?: string
    updatedAt?: string
  }[]
}
```

- 401 Unauthorized - Invalid or missing JWT token

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

### #/components/schemas/CreateRecordRequest

```ts
{
  rate?: integer
  data?: string
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

### #/components/schemas/ApiResponseDTORecordDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    rate?: integer
    data?: string
    createdAt?: string
    updatedAt?: string
  }
}
```

### #/components/schemas/RecordDTO

```ts
{
  id?: integer
  rate?: integer
  data?: string
  createdAt?: string
  updatedAt?: string
}
```

### #/components/schemas/CreateQuestRequest

```ts
{
  id?: integer
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

### #/components/schemas/DiagnosisResultSubmitRequest

```ts
{
  id?: integer
  result?: integer
  scale?: integer
}
```

### #/components/schemas/ApiResponseDTODiagnosisResultDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    diagnosisId?: integer
    result?: integer
    scale?: integer
    createdAt?: string
    updatedAt?: string
  }
}
```

### #/components/schemas/DiagnosisResultDTO

```ts
{
  id?: string
  diagnosisId?: integer
  result?: integer
  scale?: integer
  createdAt?: string
  updatedAt?: string
}
```

### #/components/schemas/RecordUpdateRequest

```ts
{
  id?: integer
  rate?: integer
  data?: string
}
```

### #/components/schemas/UpdateQuestRequest

```ts
{
  id?: string
  current?: integer
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

### #/components/schemas/ApiResponseDTODiagnosisDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    type?: enum[Simple, PHQ_9, BDI]
    title?: string
    description?: string
    questions: {
      seq?: integer
      text?: string
      answers: {
        text?: string
        score?: integer
      }[]
    }[]
    scale: {
      start?: integer
      scaleName?: string
      description?: string
    }[]
    createdAt?: string
    updatedAt?: string
  }
}
```

### #/components/schemas/DiagnosisDTO

```ts
{
  id?: integer
  type?: enum[Simple, PHQ_9, BDI]
  title?: string
  description?: string
  questions: {
    seq?: integer
    text?: string
    answers: {
      text?: string
      score?: integer
    }[]
  }[]
  scale: {
    start?: integer
    scaleName?: string
    description?: string
  }[]
  createdAt?: string
  updatedAt?: string
}
```

### #/components/schemas/DiagnosisQuestionDTO

```ts
{
  seq?: integer
  text?: string
  answers: {
    text?: string
    score?: integer
  }[]
}
```

### #/components/schemas/DiagnosisScaleDTO

```ts
{
  start?: integer
  scaleName?: string
  description?: string
}
```

### #/components/schemas/DiagnosisTextDTO

```ts
{
  text?: string
  score?: integer
}
```

### #/components/schemas/ApiResponseDTOListDiagnosisResultDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    diagnosisId?: integer
    result?: integer
    scale?: integer
    createdAt?: string
    updatedAt?: string
  }[]
}
```

### #/components/schemas/ApiResponseDTOListDiagnosisDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    type?: enum[Simple, PHQ_9, BDI]
    title?: string
    description?: string
    questions: {
      seq?: integer
      text?: string
      answers: {
        text?: string
        score?: integer
      }[]
    }[]
    scale: {
      start?: integer
      scaleName?: string
      description?: string
    }[]
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
