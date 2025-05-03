# Wuung API Server

> Version v1.0.0

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| PUT | [/records/create](#putrecordscreate) | Create new record |
| PUT | [/quests](#putquests) | Create a new quest |
| POST | [/quests](#postquests) | Update quest progress |
| PUT | [/diagnosis/submit](#putdiagnosissubmit) | Submit diagnosis result |
| POST | [/records/modify](#postrecordsmodify) | Modify existing record |
| POST | [/auth/update](#postauthupdate) | Update user information |
| POST | [/auth/signup](#postauthsignup) | Sign up new user and generate new tokens |
| POST | [/auth/refresh](#postauthrefresh) | Refresh JWT tokens |
| POST | [/auth/logout](#postauthlogout) | Logout user |
| POST | [/auth/login](#postauthlogin) | Authenticate user and generate JWT tokens |
| GET | [/records/me](#getrecordsme) | Get record by date |
| GET | [/quests/me](#getquestsme) | Get my quests |
| GET | [/quests/list](#getquestslist) | List all quests |
| GET | [/quests/list/{type}](#getquestslisttype) | List quests by type |
| GET | [/quests/list/{type}/{step}](#getquestslisttypestep) | List quests by type and step |
| GET | [/diagnosis/{id}](#getdiagnosisid) | Get diagnosis by ID |
| GET | [/diagnosis/results](#getdiagnosisresults) | Get diagnosis results |
| GET | [/diagnosis/list](#getdiagnosislist) | Get all diagnosis list |
| GET | [/auth/me](#getauthme) | Get current user's information |

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
| UpdateUserRequest | [#/components/schemas/UpdateUserRequest](#componentsschemasupdateuserrequest) |  |
| ApiResponseDTOUpdateUserResponse | [#/components/schemas/ApiResponseDTOUpdateUserResponse](#componentsschemasapiresponsedtoupdateuserresponse) |  |
| UpdateUserResponse | [#/components/schemas/UpdateUserResponse](#componentsschemasupdateuserresponse) |  |
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
| ApiResponseDTOListQuestsDTO | [#/components/schemas/ApiResponseDTOListQuestsDTO](#componentsschemasapiresponsedtolistquestsdto) |  |
| QuestsDTO | [#/components/schemas/QuestsDTO](#componentsschemasquestsdto) |  |
| ApiResponseDTOQuestsDTO | [#/components/schemas/ApiResponseDTOQuestsDTO](#componentsschemasapiresponsedtoquestsdto) |  |
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
  
        Create a new record with rate and data.  
        AccessToken is required for all of this part of endpoints on Authorization header.  
    

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
  
            Creates a new quest instance for the authenticated user.  
            Required parameter is quest (unique) id.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
        

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
  
            Updates the progress of a quest for the authenticated user.  
            Required parameter is quest (unique) id.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
        

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

### [PUT]/diagnosis/submit

- Summary  
Submit diagnosis result

- Description  
  
            Submit a new diagnosis result for the authenticated user.  
            AccessToken is required for this part of endpoints on Authorization header.  
        

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
  
        Update rate and data of an existing record.  
        AccessToken is required for all of this part of endpoints on Authorization header.  
    

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

### [POST]/auth/update

- Summary  
Update user information

- Description  
  
            Updates user information. Null fields will be ignored.  
            The response will include the updated user's email, username, gender, and birth date.  
            The user's information will be updated in the database.  
            This endpoint is protected and requires a valid access token.  
        

#### RequestBody

- application/json

```ts
{
  password?: string
  gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  user_name?: string
  // Birth date in format yyyy-MM-dd
  birth_date?: string
}
```

#### Responses

- 200 Successfully updated user information

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    email?: string
    userName?: string
    gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate?: string
  }
}
```

- 401 Unauthorized - Invalid or missing access token

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

### [POST]/auth/signup

- Summary  
Sign up new user and generate new tokens

- Description  
  
            Create new user provided credentials with additional fields and generate tokens for access.  
            Tokens are valid for 15 minutes.  
            The refresh token can be used to obtain new access tokens until they expire.  
            This endpoint is not protected and can be used by unauthenticated clients.  
        

#### RequestBody

- application/json

```ts
{
  email?: string
  password?: string
  gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
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
        Tokens are valid for 15 minutes.  
        The refresh token can be used to obtain new access tokens until they expire.  
        This endpoint is not protected and can be used by unauthenticated clients.  
    

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
  
        Invalidates refresh tokens for the user. The user will need to authenticate again to obtain new tokens.  
        This endpoint is protected and requires a valid access token.  
    

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
        Tokens are valid for 15 minutes.  
        Refreshed tokens will be invalidated for the previous token.  
        The refresh token can be used to obtain new access tokens until they expire.  
        This endpoint is not protected and can be used by unauthenticated clients.  
    

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
  
        Get a user's record for a specific date.  
        AccessToken is required for all of this part of endpoints on Authorization header.  
    

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
  
            Get my quests with optional filter by start date.  
            Start date is in format yyyy-MM-dd.  
            If start date is not provided, it will return all quests.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
        

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

### [GET]/quests/list

- Summary  
List all quests

- Description  
  
            Get a list of all available quests.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
        

#### Responses

- 200 Successfully retrieved quests list

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    name?: string
    description?: string
    target?: integer
    createdAt?: string
    updatedAt?: string
  }[]
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

### [GET]/quests/list/{type}

- Summary  
List quests by type

- Description  
  
           Get a list of quests filtered by type.  
           AccessToken is required for all of this part of endpoints on Authorization header.  
        

#### Responses

- 200 Successfully retrieved filtered quests list

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    name?: string
    description?: string
    target?: integer
    createdAt?: string
    updatedAt?: string
  }[]
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

### [GET]/quests/list/{type}/{step}

- Summary  
List quests by type and step

- Description  
  
            Get a list of quests filtered by type and step number.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
        

#### Responses

- 200 Successfully retrieved filtered quests list

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    name?: string
    description?: string
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

### [GET]/diagnosis/{id}

- Summary  
Get diagnosis by ID

- Description  
  
            Retrieve diagnosis details for the specified ID.  
            AccessToken is required for this part of endpoints on Authorization header.  
        

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

### [GET]/diagnosis/results

- Summary  
Get diagnosis results

- Description  
  
            Retrieve diagnosis results for the authenticated user with optional date filtering.  
            AccessToken is required for this part of endpoints on Authorization header.  
        

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

### [GET]/diagnosis/list

- Summary  
Get all diagnosis list

- Description  
  
            Retrieve a list of all available diagnoses.  
            AccessToken is required for this part of endpoints on Authorization header.  
        

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
            The user's information will be returned in the response body.  
            The response will include the user's email, roles, and username, as well as their gender and birth date.  
            This endpoint is protected and requires a valid access token.  
        

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
    gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate?: string
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

### #/components/schemas/UpdateUserRequest

```ts
{
  password?: string
  gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  user_name?: string
  // Birth date in format yyyy-MM-dd
  birth_date?: string
}
```

### #/components/schemas/ApiResponseDTOUpdateUserResponse

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    email?: string
    userName?: string
    gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate?: string
  }
}
```

### #/components/schemas/UpdateUserResponse

```ts
{
  email?: string
  userName?: string
  gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  birthDate?: string
}
```

### #/components/schemas/SignUpRequest

```ts
{
  email?: string
  password?: string
  gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
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

### #/components/schemas/ApiResponseDTOListQuestsDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    name?: string
    description?: string
    target?: integer
    createdAt?: string
    updatedAt?: string
  }[]
}
```

### #/components/schemas/QuestsDTO

```ts
{
  id?: integer
  type?: enum[MEDITATE, ACTIVITY, EMOTION]
  name?: string
  description?: string
  target?: integer
  createdAt?: string
  updatedAt?: string
}
```

### #/components/schemas/ApiResponseDTOQuestsDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: integer
    type?: enum[MEDITATE, ACTIVITY, EMOTION]
    name?: string
    description?: string
    target?: integer
    createdAt?: string
    updatedAt?: string
  }
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
    gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate?: string
  }
}
```

### #/components/schemas/UserInfoResponse

```ts
{
  email?: string
  roles?: string[]
  username?: string
  gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  birthDate?: string
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
