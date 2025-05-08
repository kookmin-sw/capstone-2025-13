# Wuung API Server

> Version v1.0.0

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| PUT | [/record/feedback](#putrecordfeedback) | Create new feedback record |
| GET | [/record/feedback/{recordId}](#getrecordfeedbackrecordid) | Get all feedback record |
| PUT | [/record/feedback/{recordId}](#putrecordfeedbackrecordid) | Request AI feedback |
| POST | [/record/feedback/{recordId}](#postrecordfeedbackrecordid) | Update feedback record |
| PUT | [/record/create](#putrecordcreate) | Create new record |
| PUT | [/quests](#putquests) | Create a new quest |
| POST | [/quests](#postquests) | Update quest progress |
| PUT | [/diagnosis/submit](#putdiagnosissubmit) | Submit diagnosis result / 진단 결과 제출 |
| PUT | [/auth/profile](#putauthprofile) | Update user profile image / 사용자 프로필 이미지 업데이트 |
| DELETE | [/auth/profile](#deleteauthprofile) | Delete user profile image / 사용자 프로필 이미지 삭제 |
| POST | [/record/modify](#postrecordmodify) | Modify existing record information |
| POST | [/auth/update](#postauthupdate) | Update user information / 사용자 정보 업데이트 |
| POST | [/auth/signup](#postauthsignup) | Sign up new user and generate new tokens / 새 사용자 가입 및 토큰 생성 |
| POST | [/auth/refresh](#postauthrefresh) | Refresh JWT tokens / JWT 토큰 새로고침 |
| POST | [/auth/logout](#postauthlogout) | Logout user / 사용자 로그아웃 |
| POST | [/auth/login](#postauthlogin) | Authenticate user and generate JWT tokens / 사용자 인증 및 JWT 토큰 생성 |
| GET | [/record/me](#getrecordme) | Get record information for a specific date |
| GET | [/record/feedback/{recordFeedbackId}](#getrecordfeedbackrecordfeedbackid) | Get feedback record |
| GET | [/quests/me](#getquestsme) | Get my quests |
| GET | [/quests/list](#getquestslist) | List all quests |
| GET | [/quests/list/{type}](#getquestslisttype) | List quests by type |
| GET | [/quests/list/{type}/{step}](#getquestslisttypestep) | List quests by type and step |
| GET | [/diagnosis/{id}](#getdiagnosisid) | Get diagnosis by ID / ID로 진단 조회 |
| GET | [/diagnosis/results](#getdiagnosisresults) | Get diagnosis results / 진단 결과 조회 |
| GET | [/diagnosis/list](#getdiagnosislist) | Get all diagnosis list / 전체 진단 목록 조회 |
| GET | [/auth/me](#getauthme) | Get current user's information / 현재 사용자 정보 조회 |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| ApiResponseDTO | [#/components/schemas/ApiResponseDTO](#componentsschemasapiresponsedto) |  |
| RecordFeedbackRequest | [#/components/schemas/RecordFeedbackRequest](#componentsschemasrecordfeedbackrequest) |  |
| ApiResponseDTOString | [#/components/schemas/ApiResponseDTOString](#componentsschemasapiresponsedtostring) |  |
| CreateRecordRequest | [#/components/schemas/CreateRecordRequest](#componentsschemascreaterecordrequest) |  |
| ApiResponseDTORecordDTO | [#/components/schemas/ApiResponseDTORecordDTO](#componentsschemasapiresponsedtorecorddto) |  |
| RecordDTO | [#/components/schemas/RecordDTO](#componentsschemasrecorddto) |  |
| RecordFeedbackDTO | [#/components/schemas/RecordFeedbackDTO](#componentsschemasrecordfeedbackdto) |  |
| CreateQuestRequest | [#/components/schemas/CreateQuestRequest](#componentsschemascreatequestrequest) |  |
| ApiResponseDTOUserQuestsDTO | [#/components/schemas/ApiResponseDTOUserQuestsDTO](#componentsschemasapiresponsedtouserquestsdto) |  |
| UserQuestsDTO | [#/components/schemas/UserQuestsDTO](#componentsschemasuserquestsdto) |  |
| DiagnosisResultSubmitRequest | [#/components/schemas/DiagnosisResultSubmitRequest](#componentsschemasdiagnosisresultsubmitrequest) |  |
| ApiResponseDTODiagnosisResultDTO | [#/components/schemas/ApiResponseDTODiagnosisResultDTO](#componentsschemasapiresponsedtodiagnosisresultdto) |  |
| DiagnosisResultDTO | [#/components/schemas/DiagnosisResultDTO](#componentsschemasdiagnosisresultdto) |  |
| ApiResponseDTOUserInfoDTO | [#/components/schemas/ApiResponseDTOUserInfoDTO](#componentsschemasapiresponsedtouserinfodto) |  |
| UserInfoDTO | [#/components/schemas/UserInfoDTO](#componentsschemasuserinfodto) |  |
| RecordUpdateRequest | [#/components/schemas/RecordUpdateRequest](#componentsschemasrecordupdaterequest) |  |
| UpdateFeedbackRequest | [#/components/schemas/UpdateFeedbackRequest](#componentsschemasupdatefeedbackrequest) |  |
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
| LoginRequest | [#/components/schemas/LoginRequest](#componentsschemasloginrequest) |  |
| ApiResponseDTOLoginResponse | [#/components/schemas/ApiResponseDTOLoginResponse](#componentsschemasapiresponsedtologinresponse) |  |
| LoginResponse | [#/components/schemas/LoginResponse](#componentsschemasloginresponse) |  |
| ApiResponseDTOListRecordFeedbackDTO | [#/components/schemas/ApiResponseDTOListRecordFeedbackDTO](#componentsschemasapiresponsedtolistrecordfeedbackdto) |  |
| ApiResponseDTORecordFeedbackDTO | [#/components/schemas/ApiResponseDTORecordFeedbackDTO](#componentsschemasapiresponsedtorecordfeedbackdto) |  |
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
| api token | [#/components/securitySchemes/api token](#componentssecurityschemesapi-token) |  |

## Path Details

***

### [PUT]/record/feedback

- Summary  
Create new feedback record

- Description  
  
        [en] Initializes a new empty feedback record associated with an existing daily record. This is the first step in the AI feedback process  
        [ko] 기존 일일 기록에 연결된 새로운 빈 피드백 기록을 초기화합니다. AI 피드백 프로세스의 첫 단계입니다  
    

#### Parameters(Query)

```ts
recordId: string
```

#### Responses

- 200 Create feedback record successfully

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 404 Record not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [GET]/record/feedback/{recordId}

- Summary  
Get all feedback record

- Description  
  
        [en] Retrieves all completed AI feedback records associated with a specific record. Only shows feedback with COMPLETED status  
        [ko] 특정 기록과 관련된 모든 완료된 AI 피드백 기록을 조회합니다. COMPLETED 상태의 피드백만 표시됩니다  
    

#### Responses

- 200 Get feedback records successfully

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
    createdAt?: string
    updatedAt?: string
  }[]
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 404 Record not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [PUT]/record/feedback/{recordId}

- Summary  
Request AI feedback

- Description  
  
        [en] Initiates an AI feedback request for a specific record. The feedback process runs asynchronously and updates the feedback status accordingly  
        [ko] 특정 기록에 대한 AI 피드백 요청을 시작합니다. 피드백 프로세스는 비동기적으로 실행되며 피드백 상태가 그에 따라 업데이트됩니다  
    

#### RequestBody

- application/json

```ts
{
  data?: string
}
```

#### Responses

- 200 Feedback request successfully

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 404 Feedback record not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 409 AI feedback is still processing

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 412 AI feedback already completed

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 500 AI feedback processing error

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [POST]/record/feedback/{recordId}

- Summary  
Update feedback record

- Description  
  
        [en] Updates the data and user comments of a completed feedback record. Only applicable to feedback with COMPLETED status  
        [ko] 완료된 피드백 기록의 데이터와 사용자 댓글을 업데이트합니다. COMPLETED 상태의 피드백에만 적용 가능합니다  
    

#### RequestBody

- application/json

```ts
{
  comment?: string
  rate?: integer
}
```

#### Responses

- 200 Update feedback successfully

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    rate?: integer
    data?: string
    createdAt?: string
    updatedAt?: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
      createdAt?: string
      updatedAt?: string
    }[]
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 404 Feedback record not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 409 AI feedback is still processing

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 500 AI feedback processing error

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [PUT]/record/create

- Summary  
Create new record

- Description  
  
        [en] Creates a new daily record with emotional rate and content. Only one record per day is allowed. Requires valid access token in Authorization header  
        [ko] 감정 수치와 내용이 포함된 새로운 일일 기록을 생성합니다. 하루에 한 개의 기록만 허용됩니다. Authorization 헤더에 유효한 접근 토큰이 필요합니다  
    

#### RequestBody

- application/json

```ts
{
  rate?: integer
  data?: string
}
```

#### Responses

- 200 Create record successfully

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    rate?: integer
    data?: string
    createdAt?: string
    updatedAt?: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
      createdAt?: string
      updatedAt?: string
    }[]
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 409 Record already created

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [PUT]/quests

- Summary  
Create a new quest

- Description  
  
            [en] Creates a new quest instance for the authenticated user.  
            Required parameter is quest (unique) id.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
              
            [ko] 인증된 사용자를 위한 새로운 퀘스트 요소를 생성합니다.  
            필수 파라미터는 퀘스트 (고유) ID입니다.  
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
}
```

- 404 Quest not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [POST]/quests

- Summary  
Update quest progress

- Description  
  
            [en] Updates the progress of a quest for the authenticated user.  
            Required parameter is quest (unique) id.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
              
            [ko] 인증된 사용자의 퀘스트 진행 상황을 업데이트합니다.  
            필수 파라미터는 퀘스트 (고유) ID입니다.  
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
}
```

- 404 Quest not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [PUT]/diagnosis/submit

- Summary  
Submit diagnosis result / 진단 결과 제출

- Description  
  
            [EN] Submit a new diagnosis result for the authenticated user.  
            AccessToken is required for this part of endpoints on Authorization header.  
              
            [KR] 인증된 사용자의 새로운 진단 결과를 제출합니다.  
            이 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
}
```

- 404 Diagnosis not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [PUT]/auth/profile

- Summary  
Update user profile image / 사용자 프로필 이미지 업데이트

- Description  
  
            [en]  
            Updates the user's profile image. The image will be uploaded to S3 storage.  
            The response will include the updated user's information including the new profile image URL.  
            Maximum file size is 5MB and only image files (jpg, jpeg, png) are allowed.  
            This endpoint is protected and requires a valid access token.  
      
            [ko]  
            사용자의 프로필 이미지를 업데이트합니다. 이미지는 S3 저장소에 업로드됩니다.  
            응답에는 새 프로필 이미지 URL을 포함한 업데이트된 사용자 정보가 포함됩니다.  
            최대 파일 크기는 5MB이며 이미지 파일(jpg, jpeg, png)만 허용됩니다.  
            이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.  
        

#### RequestBody

- multipart/form-data

```ts
{
  // Profile image file to be uploaded
  multipartFile: string
}
```

#### Responses

- 200 Successfully updated profile image

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    email?: string
    roles?: string[]
    username?: string
    gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate?: string
    createdAt?: string
    updatedAt?: string
    profile?: string
  }
}
```

- 400 Invalid file format or size

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 401 Unauthorized - Invalid or missing access token

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [DELETE]/auth/profile

- Summary  
Delete user profile image / 사용자 프로필 이미지 삭제

- Description  
  
            [en]  
            Deletes the user's profile image from S3 storage(or compatible storage)  
            and removes the profile image reference.  
            The response will include the updated user's information with no profile image.  
            This endpoint is protected and requires a valid access token.  
      
            [ko]  
            S3 저장소(또는 호환 가능한 저장소)에서 사용자의 프로필 이미지를 삭제하고  
            프로필 이미지 참조를 제거합니다.  
            응답에는 프로필 이미지가 없는 업데이트된 사용자 정보가 포함됩니다.  
            이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.  
        

#### Responses

- 200 Successfully deleted profile image

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    email?: string
    roles?: string[]
    username?: string
    gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate?: string
    createdAt?: string
    updatedAt?: string
    profile?: string
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
}
```

***

### [POST]/record/modify

- Summary  
Modify existing record information

- Description  
  
            [en] Updates the emotional rate and content data of an existing record. Only the record owner can modify their records  
            [ko] 기존 기록의 감정 수치와 내용을 수정합니다. 기록 소유자만 수정할 수 있습니다  
        
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


#### RequestBody

- application/json

```ts
{
  id?: string
  rate?: integer
}
```

#### Responses

- 200 Update record successfully

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    rate?: integer
    data?: string
    createdAt?: string
    updatedAt?: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
      createdAt?: string
      updatedAt?: string
    }[]
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 404 Record not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [POST]/auth/update

- Summary  
Update user information / 사용자 정보 업데이트

- Description  
  
            [en]  
            Updates user information. Null fields will be ignored.  
            The response will include the updated user's email, username, gender, and birth date.  
            The user's information will be updated in the database.  
            This endpoint is protected and requires a valid access token.  
      
            [ko]  
            사용자 정보를 업데이트합니다. Null 필드는 무시됩니다.  
            응답에는 업데이트된 사용자의 이메일, 사용자 이름, 성별 및 생년월일이 포함됩니다.  
            사용자 정보가 데이터베이스에서 업데이트됩니다.  
            이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.  
        

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
### [POST]/auth/signup

- Summary  
Sign up new user and generate new tokens / 새 사용자 가입 및 토큰 생성

- Description  
  
            [en]  
            Create new user provided credentials with additional fields and generate tokens for access.  
            Tokens are valid for 15 minutes.  
            The refresh token can be used to obtain new access tokens until they expire.  
            This endpoint is not protected and can be used by unauthenticated clients.  
      
            [ko]  
            추가 필드와 함께 제공된 자격 증명으로 새 사용자를 생성하고 액세스용 토큰을 생성합니다.  
            토큰은 15분간 유효합니다.  
            리프레시 토큰은 만료될 때까지 새로운 액세스 토큰을 얻는 데 사용할 수 있습니다.  
            이 엔드포인트는 보호되지 않으며 인증되지 않은 클라이언트가 사용할 수 있습니다.  
        

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
Refresh JWT tokens / JWT 토큰 새로고침

- Description  
  
        [en]  
        Generates new access and refresh tokens from a valid refresh token.  
        Tokens are valid for 15 minutes.  
        The refresh token can be used to obtain new access tokens until they expire.  
        This endpoint is not protected and can be used by unauthenticated clients.  
      
        [ko]  
        유효한 리프레시 토큰으로 새로운 액세스 및 리프레시 토큰을 생성합니다.  
        토큰은 15분간 유효합니다.  
        리프레시 토큰은 만료될 때까지 새로운 액세스 토큰을 얻는 데 사용할 수 있습니다.  
        이 엔드포인트는 보호되지 않으며 인증되지 않은 클라이언트가 사용할 수 있습니다.  
    

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
Logout user / 사용자 로그아웃

- Description  
  
        [en]  
        Invalidates refresh tokens for the user. The user will need to authenticate again to obtain new tokens.  
        This endpoint is protected and requires a valid access token.  
      
        [ko]  
        사용자의 리프레시 토큰을 무효화합니다. 사용자는 새로운 토큰을 얻기 위해 다시 인증해야 합니다.  
        이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.  
    

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
Authenticate user and generate JWT tokens / 사용자 인증 및 JWT 토큰 생성

- Description  
  
        [en]  
        Validates user credentials and provides access and refresh tokens.  
        Tokens are valid for 15 minutes.  
        Refreshed tokens will be invalidated for the previous token.  
        The refresh token can be used to obtain new access tokens until they expire.  
        This endpoint is not protected and can be used by unauthenticated clients.  
     
        [ko]  
        사용자 자격 증명을 검증하고 액세스 및 리프레시 토큰을 제공합니다.  
        토큰은 15분간 유효합니다.  
        새로고침된 토큰은 이전 토큰을 무효화합니다.  
        리프레시 토큰은 만료될 때까지 새로운 액세스 토큰을 얻는 데 사용할 수 있습니다.  
        이 엔드포인트는 보호되지 않으며 인증되지 않은 클라이언트가 사용할 수 있습니다.  
    

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
}
```

- 401 Invalid credentials

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [GET]/record/me

- Summary  
Get record information for a specific date

- Description  
  
        [en] Retrieves the most recent record for a specific date, including record ID, emotional rate, and content data  
        [ko] 특정 날짜의 가장 최근 기록을 조회합니다. 기록 ID, 감정 수치, 내용 데이터를 포함합니다  
    

#### Parameters(Query)

```ts
// Date in format yyyy-MM-dd
date: string
```

#### Responses

- 200 Get record successfully

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    rate?: integer
    data?: string
    createdAt?: string
    updatedAt?: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
      createdAt?: string
      updatedAt?: string
    }[]
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [GET]/record/feedback/{recordFeedbackId}

- Summary  
Get feedback record

- Description  
  
        [en] Retrieves detailed information about a specific feedback record, including AI feedback content and user comments  
        [ko] 특정 피드백 기록의 상세 정보를 조회합니다. AI 피드백 내용과 사용자 댓글을 포함합니다  
    

#### Responses

- 200 Get feedback record successfully

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
    createdAt?: string
    updatedAt?: string
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 404 Feedback record not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 409 AI feedback is still processing

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

- 500 AI feedback processing error

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [GET]/quests/me

- Summary  
Get my quests

- Description  
  
            [en] Get my quests with optional filter by start date.  
            Start date is in format yyyy-MM-dd.  
            If start date is not provided, it will return all quests.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
              
            [ko] 시작 날짜로 필터링 할 수 있는 내 퀘스트 목록을 가져옵니다.  
            시작 날짜는 yyyy-MM-dd 형식입니다.  
            시작 날짜가 제공되지 않으면 모든 퀘스트를 반환합니다.  
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
}
```

- 500 Internal server error

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [GET]/quests/list

- Summary  
List all quests

- Description  
  
            [en] Get a list of all available quests.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
              
            [ko] 사용 가능한 모든 퀘스트 목록을 가져옵니다.  
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
           [en] Get a list of quests filtered by type.  
           AccessToken is required for all of this part of endpoints on Authorization header.  
             
           [ko] 유형별로 필터링된 퀘스트 목록을 가져옵니다.  
           모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
            [en] Get a list of quests filtered by type and step number.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
              
            [ko] 유형과 단계 번호로 필터링된 퀘스트 목록을 가져옵니다.  
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
Get diagnosis by ID / ID로 진단 조회

- Description  
  
            [EN] Retrieve diagnosis details for the specified ID.  
            AccessToken is required for this part of endpoints on Authorization header.  
              
            [KR] 지정된 ID의 진단 상세 정보를 조회합니다.  
            이 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
}
```

- 404 Diagnosis not found

`application/json`

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

***

### [GET]/diagnosis/results

- Summary  
Get diagnosis results / 진단 결과 조회

- Description  
  
            [EN] Retrieve diagnosis results for the authenticated user with optional date filtering.  
            AccessToken is required for this part of endpoints on Authorization header.  
              
            [KR] 인증된 사용자의 진단 결과를 조회합니다. 선택적으로 날짜 필터링이 가능합니다.  
            이 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
}
```

***

### [GET]/diagnosis/list

- Summary  
Get all diagnosis list / 전체 진단 목록 조회

- Description  
  
            [EN] Retrieve a list of all available diagnoses.  
            AccessToken is required for this part of endpoints on Authorization header.  
              
            [KR] 사용 가능한 모든 진단 목록을 조회합니다.  
            이 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

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
}
```

***

### [GET]/auth/me

- Summary  
Get current user's information / 현재 사용자 정보 조회

- Description  
  
            [en]  
            Retrieves the logged-in user's information using a valid access token.  
            The user's information will be returned in the response body.  
            The response will include the user's email, roles, and username, as well as their gender and birth date.  
            This endpoint is protected and requires a valid access token.  
      
            [ko]  
            유효한 액세스 토큰을 사용하여 로그인한 사용자의 정보를 검색합니다.  
            사용자 정보는 응답 본문에 반환됩니다.  
            응답에는 사용자의 이메일, 역할, 사용자 이름과 함께 성별과 생년월일이 포함됩니다.  
            이 엔드포인트는 보호되어 있으며 유효한 액세스 토큰이 필요합니다.  
        

#### Responses

- 200 Successfully retrieved user information

`*/*`

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    email?: string
    roles?: string[]
    username?: string
    gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate?: string
    createdAt?: string
    updatedAt?: string
    profile?: string
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

### #/components/schemas/ApiResponseDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
}
```

### #/components/schemas/RecordFeedbackRequest

```ts
{
  data?: string
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

### #/components/schemas/CreateRecordRequest

```ts
{
  rate?: integer
  data?: string
}
```

### #/components/schemas/ApiResponseDTORecordDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    rate?: integer
    data?: string
    createdAt?: string
    updatedAt?: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
      createdAt?: string
      updatedAt?: string
    }[]
  }
}
```

### #/components/schemas/RecordDTO

```ts
{
  id?: string
  rate?: integer
  data?: string
  createdAt?: string
  updatedAt?: string
  feedbacks: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
    createdAt?: string
    updatedAt?: string
  }[]
}
```

### #/components/schemas/RecordFeedbackDTO

```ts
{
  id?: string
  aiFeedback?: string
  comment?: string
  data?: string
  status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
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

### #/components/schemas/ApiResponseDTOUserInfoDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    email?: string
    roles?: string[]
    username?: string
    gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate?: string
    createdAt?: string
    updatedAt?: string
    profile?: string
  }
}
```

### #/components/schemas/UserInfoDTO

```ts
{
  id?: string
  email?: string
  roles?: string[]
  username?: string
  gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  birthDate?: string
  createdAt?: string
  updatedAt?: string
  profile?: string
}
```

### #/components/schemas/RecordUpdateRequest

```ts
{
  id?: string
  rate?: integer
}
```

### #/components/schemas/UpdateFeedbackRequest

```ts
{
  comment?: string
  rate?: integer
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

### #/components/schemas/ApiResponseDTOListRecordFeedbackDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
    createdAt?: string
    updatedAt?: string
  }[]
}
```

### #/components/schemas/ApiResponseDTORecordFeedbackDTO

```ts
{
  error?: boolean
  message?: string
  code?: integer
  data: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status?: enum[QUEUED, PROCESSING, COMPLETED, PROCESSING_ERROR]
    createdAt?: string
    updatedAt?: string
  }
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

### #/components/securitySchemes/api token

```ts
{
  "type": "http",
  "name": "api token",
  "scheme": "bearer"
}
```
