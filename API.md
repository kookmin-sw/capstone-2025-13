# Wuung API Server

> Version v1.0.0

## Path Table

| Method | Path | Description                                                           |
| --- | --- |-----------------------------------------------------------------------|
| PUT | [/topic/feedback/{topicId}](#puttopicfeedbacktopicid) | Request AI feedback                                                   |
| POST | [/topic/feedback/{topicId}](#posttopicfeedbacktopicid) | Update feedback topic                                                 |
| PUT | [/topic/create](#puttopiccreate) | Create new topic                                                      |
| PUT | [/records/create](#putrecordscreate) | [en] Create new record                                                
[ko] 새로운 기록 생성 |
| PUT | [/quests](#putquests) | Create a new quest                                                    |
| POST | [/quests](#postquests) | Update quest progress                                                 |
| PUT | [/quests/photo/{userQuestID}](#putquestsphotouserquestid) | Upload quest photo                                                    |
| DELETE | [/quests/photo/{userQuestID}](#deletequestsphotouserquestid) | Delete quest photo                                                    |
| PUT | [/diagnosis/submit](#putdiagnosissubmit) | Submit diagnosis result / 진단 결과 제출                                    |
| PUT | [/auth/profile](#putauthprofile) | Update user profile image / 사용자 프로필 이미지 업데이트                          |
| DELETE | [/auth/profile](#deleteauthprofile) | Delete user profile image / 사용자 프로필 이미지 삭제                            |
| POST | [/topic/modify/{topicId}](#posttopicmodifytopicid) | Modify existing topic information                                     |
| GET | [/records/{recordId}](#getrecordsrecordid) | [en] Get record by ID                                                 
[ko] ID별 기록 조회 |
| POST | [/records/{recordId}](#postrecordsrecordid) | [en] Update final record feedback                                     
[ko] 기록 최종 수정 |
| GET | [/quests/stage](#getquestsstage) | Get quest stages                                                      |
| POST | [/quests/stage](#postquestsstage) | Increment all quests circular                                         |
| GET | [/quests/stage/{type}](#getquestsstagetype) | Get quest stage by type                                               |
| POST | [/quests/stage/{type}](#postquestsstagetype) | Increment quest circular specific type by 1                           |
| POST | [/pot/usecoupon](#postpotusecoupon) | [en] use a coupon [ko] 하나의 쿠폰 사용                                      |
| POST | [/pot/getcoupon](#postpotgetcoupon) | [en] increase coupon [ko] 새로운 쿠폰 획득                                   |
| POST | [/auth/update](#postauthupdate) | Update user information / 사용자 정보 업데이트                                 |
| POST | [/auth/signup](#postauthsignup) | Sign up new user and generate new tokens / 새 사용자 가입 및 토큰 생성           |
| POST | [/auth/refresh](#postauthrefresh) | Refresh JWT tokens / JWT 토큰 새로고침                                      |
| POST | [/auth/logout](#postauthlogout) | Logout user / 사용자 로그아웃                                                |
| POST | [/auth/login](#postauthlogin) | Authenticate user and generate JWT tokens / 사용자 인증 및 JWT 토큰 생성        |
| GET | [/topic/{topicId}](#gettopictopicid) | Get all feedback topic                                                |
| GET | [/topic/me](#gettopicme) | Get topic information for a specific date                             |
| GET | [/topic/feedback/{topicFeedbackId}](#gettopicfeedbacktopicfeedbackid) | Get feedback topic                                                    |
| GET | [/records/me](#getrecordsme) | [en] Get record by date [ko] 날짜별 기록 조회                                |
| GET | [/quests/quote](#getquestsquote) | Get random life quote                                                 |
| GET | [/quests/me](#getquestsme) | Get my quests                                                         |
| GET | [/quests/list](#getquestslist) | List all quests                                                       |
| GET | [/quests/list/{type}](#getquestslisttype) | List quests by type                                                   |
| GET | [/quests/list/{type}/{step}](#getquestslisttypestep) | List quests by type and step                                          |
| GET | [/quests/last](#getquestslast) | Get current quests                                                    |
| GET | [/quests/last/{type}](#getquestslasttype) | Get current quest by type                                             |
| GET | [/pot/status](#getpotstatus) | [en] get pot status [ko] 화분 상태 조회                                     |
| GET | [/etc/behavior](#getetcbehavior) | [En] Get User behavior information by date / [Kr] 특정 날짜의 사용자 활동 정보 조회 |
| GET | [/etc/behavior/summary](#getetcbehaviorsummary) | [En] Get User behavior summary by month / [Kr] 월별 사용자 활동 요약 조회        |
| GET | [/diagnosis/{id}](#getdiagnosisid) | Get diagnosis by ID / ID로 진단 조회                                       |
| GET | [/diagnosis/results](#getdiagnosisresults) | Get diagnosis results / 진단 결과 조회                                      |
| GET | [/diagnosis/list](#getdiagnosislist) | Get all diagnosis list / 전체 진단 목록 조회                                  |
| GET | [/auth/me](#getauthme) | Get current user's information / 현재 사용자 정보 조회                         |
| GET | [/admin/export/{className}](#getadminexportclassname) |                                                                       |
| GET | [/admin/download/{className}/{fieldName}/{id}](#getadmindownloadclassnamefieldnameid) |                                                                       |
| GET | [/admin/download/{className}/{fieldName}/{id}/image](#getadmindownloadclassnamefieldnameidimage) |                                                                       |
| GET | [/admin/api/autocomplete/{className}](#getadminapiautocompleteclassname) |                                                                       |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| TopicFeedbackRequest | [#/components/schemas/TopicFeedbackRequest](#componentsschemastopicfeedbackrequest) |  |
| ApiResponseDTO | [#/components/schemas/ApiResponseDTO](#componentsschemasapiresponsedto) |  |
| ApiResponseDTOString | [#/components/schemas/ApiResponseDTOString](#componentsschemasapiresponsedtostring) |  |
| ApiResponseDTOTopicDTO | [#/components/schemas/ApiResponseDTOTopicDTO](#componentsschemasapiresponsedtotopicdto) |  |
| TopicDTO | [#/components/schemas/TopicDTO](#componentsschemastopicdto) |  |
| TopicFeedbackDTO | [#/components/schemas/TopicFeedbackDTO](#componentsschemastopicfeedbackdto) |  |
| CreateRecordRequest | [#/components/schemas/CreateRecordRequest](#componentsschemascreaterecordrequest) |  |
| ApiResponseDTORecordDTO | [#/components/schemas/ApiResponseDTORecordDTO](#componentsschemasapiresponsedtorecorddto) |  |
| RecordDTO | [#/components/schemas/RecordDTO](#componentsschemasrecorddto) |  |
| CreateQuestRequest | [#/components/schemas/CreateQuestRequest](#componentsschemascreatequestrequest) |  |
| ApiResponseDTOUserQuestsDTO | [#/components/schemas/ApiResponseDTOUserQuestsDTO](#componentsschemasapiresponsedtouserquestsdto) |  |
| UserQuestsDTO | [#/components/schemas/UserQuestsDTO](#componentsschemasuserquestsdto) |  |
| DiagnosisResultSubmitRequest | [#/components/schemas/DiagnosisResultSubmitRequest](#componentsschemasdiagnosisresultsubmitrequest) |  |
| ApiResponseDTODiagnosisResultDTO | [#/components/schemas/ApiResponseDTODiagnosisResultDTO](#componentsschemasapiresponsedtodiagnosisresultdto) |  |
| DiagnosisResultDTO | [#/components/schemas/DiagnosisResultDTO](#componentsschemasdiagnosisresultdto) |  |
| ApiResponseDTOUserInfoDTO | [#/components/schemas/ApiResponseDTOUserInfoDTO](#componentsschemasapiresponsedtouserinfodto) |  |
| UserInfoDTO | [#/components/schemas/UserInfoDTO](#componentsschemasuserinfodto) |  |
| TopicUpdateRequest | [#/components/schemas/TopicUpdateRequest](#componentsschemastopicupdaterequest) |  |
| UpdateFeedbackRequest | [#/components/schemas/UpdateFeedbackRequest](#componentsschemasupdatefeedbackrequest) |  |
| RecordUpdateRequest | [#/components/schemas/RecordUpdateRequest](#componentsschemasrecordupdaterequest) |  |
| UpdateQuestRequest | [#/components/schemas/UpdateQuestRequest](#componentsschemasupdatequestrequest) |  |
| ApiResponseDTOPotStatusDTO | [#/components/schemas/ApiResponseDTOPotStatusDTO](#componentsschemasapiresponsedtopotstatusdto) |  |
| PotStatusDTO | [#/components/schemas/PotStatusDTO](#componentsschemaspotstatusdto) |  |
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
| ApiResponseDTOListTopicFeedbackDTO | [#/components/schemas/ApiResponseDTOListTopicFeedbackDTO](#componentsschemasapiresponsedtolisttopicfeedbackdto) |  |
| ApiResponseDTOTopicFeedbackDTO | [#/components/schemas/ApiResponseDTOTopicFeedbackDTO](#componentsschemasapiresponsedtotopicfeedbackdto) |  |
| ApiResponseDTOListUserQuestStagesDTO | [#/components/schemas/ApiResponseDTOListUserQuestStagesDTO](#componentsschemasapiresponsedtolistuserqueststagesdto) |  |
| UserQuestStagesDTO | [#/components/schemas/UserQuestStagesDTO](#componentsschemasuserqueststagesdto) |  |
| ApiResponseDTOInteger | [#/components/schemas/ApiResponseDTOInteger](#componentsschemasapiresponsedtointeger) |  |
| ApiResponseDTOListUserQuestsDTO | [#/components/schemas/ApiResponseDTOListUserQuestsDTO](#componentsschemasapiresponsedtolistuserquestsdto) |  |
| ApiResponseDTOListQuestsDTO | [#/components/schemas/ApiResponseDTOListQuestsDTO](#componentsschemasapiresponsedtolistquestsdto) |  |
| QuestsDTO | [#/components/schemas/QuestsDTO](#componentsschemasquestsdto) |  |
| ApiResponseDTOQuestsDTO | [#/components/schemas/ApiResponseDTOQuestsDTO](#componentsschemasapiresponsedtoquestsdto) |  |
| ApiResponseDTOMapQuestTypeUserQuestsDTO | [#/components/schemas/ApiResponseDTOMapQuestTypeUserQuestsDTO](#componentsschemasapiresponsedtomapquesttypeuserquestsdto) |  |
| ApiResponseDTOListDailyBehaviorDTO | [#/components/schemas/ApiResponseDTOListDailyBehaviorDTO](#componentsschemasapiresponsedtolistdailybehaviordto) |  |
| DailyBehaviorDTO | [#/components/schemas/DailyBehaviorDTO](#componentsschemasdailybehaviordto) |  |
| ApiResponseDTOListString | [#/components/schemas/ApiResponseDTOListString](#componentsschemasapiresponsedtoliststring) |  |
| ApiResponseDTODiagnosisDTO | [#/components/schemas/ApiResponseDTODiagnosisDTO](#componentsschemasapiresponsedtodiagnosisdto) |  |
| DiagnosisDTO | [#/components/schemas/DiagnosisDTO](#componentsschemasdiagnosisdto) |  |
| DiagnosisQuestionDTO | [#/components/schemas/DiagnosisQuestionDTO](#componentsschemasdiagnosisquestiondto) |  |
| DiagnosisScaleDTO | [#/components/schemas/DiagnosisScaleDTO](#componentsschemasdiagnosisscaledto) |  |
| DiagnosisTextDTO | [#/components/schemas/DiagnosisTextDTO](#componentsschemasdiagnosistextdto) |  |
| ApiResponseDTOListDiagnosisResultDTO | [#/components/schemas/ApiResponseDTOListDiagnosisResultDTO](#componentsschemasapiresponsedtolistdiagnosisresultdto) |  |
| ApiResponseDTOListDiagnosisDTO | [#/components/schemas/ApiResponseDTOListDiagnosisDTO](#componentsschemasapiresponsedtolistdiagnosisdto) |  |
| MultiValueMapStringString | [#/components/schemas/MultiValueMapStringString](#componentsschemasmultivaluemapstringstring) |  |
| api token | [#/components/securitySchemes/api token](#componentssecurityschemesapi-token) |  |

## Path Details

***

### [PUT]/topic/feedback/{topicId}

- Summary  
Request AI feedback

- Description  
  
        [en] Initiates an AI feedback request for a specific topic. The feedback process runs asynchronously and updates the feedback status accordingly  
        [ko] 특정 기록에 대한 AI 피드백 요청을 시작합니다. 피드백 프로세스는 비동기적으로 실행되며 피드백 상태가 그에 따라 업데이트됩니다, 피드백의 개수가 5개 이상일 경우, 피드백을 받지 않는 사용자 데이터 저장 용도의 레코드를 생성합니다.  
    

#### RequestBody

- application/json

```ts
{
  data: string
}
```

#### Responses

- 200 Feedback request successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data?: string
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 403 Limit Reached, Feedback can't add

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Feedback topic not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 409 AI feedback is still processing

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 412 AI feedback already completed

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 AI feedback processing error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [POST]/topic/feedback/{topicId}

- Summary  
Update feedback topic

- Description  
  
        [en] Updates the data and user comments of a completed feedback topic. Only the topic owner can update their topics feedbacks. Only applies to COMPLETED feedback topics.  
        [ko] 완료된 피드백 기록의 데이터와 사용자 댓글을 업데이트합니다. 레코드의 주인만 레코드의 피드백을 수정할 수 있습니다. 마지막 요청이 COMPLETED 상태인 피드백에만 적용 가능합니다.  
    

#### RequestBody

- application/json

```ts
{
  // User comment for the feedback
  comment: string
  // 
  //         [en] Rating score (1-5 stars)
  //         [ko] 별점 점수 (1-5점)
  //     
  rate: integer
}
```

#### Responses

- 200 Update feedback successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    // 
    //         [en] Rating score (1-5 stars), default value is 0 (unrated)
    //         [ko] 별점 점수 (1-5점), 기본값은 0이다. (평가하지 않음)
    //     
    rate: integer
    data: string
    createdAt: string
    updatedAt: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
      createdAt: string
      updatedAt: string
    }[]
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 403 No Feedback record can't update

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Feedback topic not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 409 AI feedback is still processing

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 AI feedback processing error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [PUT]/topic/create

- Summary  
Create new topic

- Description  
  
        [en] Creates a new daily topic with emotional rate and content. Only one topic per day is allowed. Requires valid access token in Authorization header  
        [ko] 감정 수치와 내용이 포함된 새로운 일일 기록을 생성합니다. 하루에 한 개의 기록만 허용됩니다. Authorization 헤더에 유효한 접근 토큰이 필요합니다  
    

#### Responses

- 200 Create topic successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    // 
    //         [en] Rating score (1-5 stars), default value is 0 (unrated)
    //         [ko] 별점 점수 (1-5점), 기본값은 0이다. (평가하지 않음)
    //     
    rate: integer
    data: string
    createdAt: string
    updatedAt: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
      createdAt: string
      updatedAt: string
    }[]
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 409 Topic already created

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [PUT]/records/create

- Summary  
[en] Create new record  
[ko] 새로운 기록 생성

- Description  
[en] Create a new record with data  
[ko] 데이터로 새로운 기록을 생성합니다

#### RequestBody

- application/json

```ts
{
  data: string
}
```

#### Responses

- 200 [en] Successfully created record
[ko] 기록 생성 성공

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    rate: integer
    data: string
    luckyVicky: string
    comment: string
    status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
    createdAt: string
    updatedAt: string
  }
}
```

- 403 [en] Unauthorized access
[ko] 권한 없음

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  id: integer
}
```

#### Responses

- 200 Successfully created quest

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    name: string
    description: string
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    progress: integer
    target: integer
    status: enum[COMPLETED, INCOMPLETE, PROCESSING]
    step: integer
    createdAt: string
    updatedAt: string
    photo?: string
  }
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Quest not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  id: string
  current: integer
  status: enum[COMPLETED, INCOMPLETE, PROCESSING]
}
```

#### Responses

- 200 Successfully updated quest

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    name: string
    description: string
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    progress: integer
    target: integer
    status: enum[COMPLETED, INCOMPLETE, PROCESSING]
    step: integer
    createdAt: string
    updatedAt: string
    photo?: string
  }
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Quest not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [PUT]/quests/photo/{userQuestID}

- Summary  
Upload quest photo

- Description  
  
            [en] Upload a photo for a specific quest.  
            AccessToken is required on Authorization header.  
              
            [ko] 특정 퀘스트에 사진을 업로드합니다.  
            Authorization 헤더에 AccessToken이 필요합니다.  
        

#### RequestBody

- multipart/form-data

```ts
{
  file: string
}
```

#### Responses

- 200 Successfully uploaded photo

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    name: string
    description: string
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    progress: integer
    target: integer
    status: enum[COMPLETED, INCOMPLETE, PROCESSING]
    step: integer
    createdAt: string
    updatedAt: string
    photo?: string
  }
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Quest not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [DELETE]/quests/photo/{userQuestID}

- Summary  
Delete quest photo

- Description  
  
            [en] Delete the photo of a specific quest.  
            AccessToken is required on Authorization header.  
              
            [ko] 특정 퀘스트의 사진을 삭제합니다.  
            Authorization 헤더에 AccessToken이 필요합니다.  
        

#### Responses

- 200 Successfully deleted photo

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    name: string
    description: string
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    progress: integer
    target: integer
    status: enum[COMPLETED, INCOMPLETE, PROCESSING]
    step: integer
    createdAt: string
    updatedAt: string
    photo?: string
  }
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Quest not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  id: integer
  result: integer
  scale: integer
}
```

#### Responses

- 200 Successfully submitted diagnosis result

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    diagnosisId: integer
    result: integer
    scale: integer
    createdAt: string
    updatedAt: string
  }
}
```

- 401 Unauthorized - Invalid or missing JWT token

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Diagnosis not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    email: string
    roles?: string[]
    username: string
    gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate: string
    createdAt: string
    updatedAt: string
    profile?: string
  }
}
```

- 400 Invalid file format or size

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 401 Unauthorized - Invalid or missing access token

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    email: string
    roles?: string[]
    username: string
    gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate: string
    createdAt: string
    updatedAt: string
    profile?: string
  }
}
```

- 401 Unauthorized - Invalid or missing access token

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [POST]/topic/modify/{topicId}

- Summary  
Modify existing topic information

- Description  
  
            [en] Updates the emotional rate and content data of an existing topic. Only the topic owner can modify their topics  
            [ko] 기존 기록의 감정 수치와 내용을 수정합니다. 기록 소유자만 수정할 수 있습니다  
        

#### RequestBody

- application/json

```ts
{
  // 
  //         [en] Rating score (1-5 stars)
  //         [ko] 별점 점수 (1-5점)
  //     
  rate: integer
  data: string
}
```

#### Responses

- 200 Update topic successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    // 
    //         [en] Rating score (1-5 stars), default value is 0 (unrated)
    //         [ko] 별점 점수 (1-5점), 기본값은 0이다. (평가하지 않음)
    //     
    rate: integer
    data: string
    createdAt: string
    updatedAt: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
      createdAt: string
      updatedAt: string
    }[]
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Topic not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/records/{recordId}

- Summary  
[en] Get record by ID  
[ko] ID별 기록 조회

- Description  
[en] Get a specific record by its ID  
[ko] ID로 특정 기록을 조회합니다

#### Parameters(Query)

```ts
// Record ID
recordId: string
```

#### Responses

- 200 [en] Successfully retrieved record
[ko] 기록 조회 성공

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    rate: integer
    data: string
    luckyVicky: string
    comment: string
    status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
    createdAt: string
    updatedAt: string
  }
}
```

- 403 [en] Unauthorized access
[ko] 권한 없음

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 [en] Record not found
[ko] 기록을 찾을 수 없음

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [POST]/records/{recordId}

- Summary  
[en] Update final record feedback  
[ko] 기록 최종 수정

- Description  
[en] Update final feedback (rate and comment) after Lucky Vicky AI processing is completed  
[ko] 기존 기록에서 럭키비키가 완료되었을 때 최종 데이터를 집어넣는 엔드포인트입니다.

#### RequestBody

- application/json

```ts
{
  rate: integer
  comment: string
}
```

#### Responses

- 200 [en] Successfully updated record feedback
[ko] 기록 수정 성공

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    rate: integer
    data: string
    luckyVicky: string
    comment: string
    status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
    createdAt: string
    updatedAt: string
  }
}
```

- 403 [en] Unauthorized access
[ko] 권한 없음

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 [en] Record not found
[ko] 기록을 찾을 수 없음

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/quests/stage

- Summary  
Get quest stages

- Description  
  
            [en] Get all quest stages for the authenticated user.  
            AccessToken is required on Authorization header.  
  
            [ko] 인증된 사용자의 모든 퀘스트 스테이지를 가져옵니다.  
            Authorization 헤더에 AccessToken이 필요합니다.  
        

#### Responses

- 200 Successfully retrieved quest stages

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    stage: integer
    createdAt: string
    updatedAt: string
  }[]
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [POST]/quests/stage

- Summary  
Increment all quests circular

- Description  
  
        [en] Increment all quest circular by 1 for the authenticated user.  
        AccessToken is required on Authorization header.  
          
        [ko] 인증된 사용자의 모든 퀘스트 서큘러값을 1씩 증가시킵니다.  
        Authorization 헤더에 AccessToken이 필요합니다.  
    

#### Responses

- 200 update quest circular successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data?: string
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/quests/stage/{type}

- Summary  
Get quest stage by type

- Description  
  
            [en] Get quest stage for specific type.  
            AccessToken is required on Authorization header.  
              
            [ko] 특정 타입의 퀘스트 스테이지를 가져옵니다.  
            Authorization 헤더에 AccessToken이 필요합니다.  
        

#### Responses

- 200 Successfully retrieved quest stage

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data?: integer
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Quest stage not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [POST]/quests/stage/{type}

- Summary  
Increment quest circular specific type by 1

- Description  
  
        [en] Increment quest circular count by 1 for specific type.  
        AccessToken is required on Authorization header.  
          
        [ko] 특정 타입의 퀘스트 서큘러 값을 1 증가시킵니다.  
        Authorization 헤더에 AccessToken이 필요합니다.  
    

#### Responses

- 200 update quest circular successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data?: string
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Stage not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [POST]/pot/usecoupon

- Summary  
[en] use a coupon [ko] 하나의 쿠폰 사용

- Description  
  
        [en]  
        Uses one coupon to gain experience points. If experience points reach the required amount,  
        the pot will level up and experience points will be reset to 0.  
        This endpoint is protected and requires authentication.  
          
        [ko]  
        쿠폰 하나를 사용하여 경험치를 획득합니다. 경험치가 필요량에 도달하면  
        화분의 레벨이 올라가고 경험치가 0으로 초기화됩니다.  
        개발자가 정의한 레벨을 초과한 레벨업 시도시 상태값 445를 반환합니다.  
        이 엔드포인트는 보호되어 있으며 사용을 위해서 accessToken이 필요합니다.  
    

#### Responses

- 200 use coupon successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    level: integer
    exp: integer
    need: integer
    coupon: integer
  }
}
```

- 403 Unauthorized access

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 pot not found

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 444 Not enough coupon

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 445 Max level reached

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [POST]/pot/getcoupon

- Summary  
[en] increase coupon [ko] 새로운 쿠폰 획득

- Description  
  
        [en]  
        Adds one coupon to user's pot and returns the updated pot status.  
        This endpoint is protected and requires authentication.  
          
        [ko]  
        사용자의 화분에 쿠폰 하나를 추가하고 업데이트된 화분 상태를 반환합니다.  
        이 엔드포인트는 보호되어 있으며 사용을 위해서 accessToken이 필요합니다.  
    

#### Responses

- 200 get coupon successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    level: integer
    exp: integer
    need: integer
    coupon: integer
  }
}
```

- 403 Unauthorized access

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 pot not found

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
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
  user_name?: string
  password?: string
  gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  // Birth date in format yyyy-MM-dd
  birth_date?: string
}
```

#### Responses

- 200 Successfully updated user information

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    email: string
    userName: string
    gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate: string
  }
}
```

- 401 Unauthorized - Invalid or missing access token

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

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
  user_name: string
  email: string
  password: string
  gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  // Birth date in format yyyy-MM-dd
  birth_date: string
}
```

#### Responses

- 200 sign up user

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    accessToken: string
    refreshToken: string
  }
}
```

- 409 sign up failed

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
  refreshToken: string
}
```

#### Responses

- 200 Successfully refreshed tokens

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    accessToken: string
    refreshToken: string
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
  accessToken: string
  refreshToken: string
}
```

#### Responses

- 200 Successfully logged out

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
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
  email: string
  password: string
}
```

#### Responses

- 200 Successfully authenticated

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    accessToken: string
    refreshToken: string
  }
}
```

- 400 Bad Request

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 401 Invalid credentials

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/topic/{topicId}

- Summary  
Get all feedback topic

- Description  
  
        [en] Retrieves all completed AI feedback topics associated with a specific topic. Only shows feedback with COMPLETED status  
        [ko] 특정 기록과 관련된 모든 피드백을 조회합니다. COMPLETED 상태의 피드백과 NOFEEDBACK 상태의 피드백도 표시됩니다  
    

#### Responses

- 200 Get feedback topics successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
    createdAt: string
    updatedAt: string
  }[]
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Topic not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/topic/me

- Summary  
Get topic information for a specific date

- Description  
  
        [en] Retrieves the most recent topic for a specific date, including topic ID, emotional rate, and content data. Defaults to the current date if no date is specified.  
        [ko] 특정 날짜의 가장 최근 기록을 조회합니다. 기록 ID, 감정 수치, 내용 데이터를 포함합니다. 기본 값은 오늘 입니다.  
    

#### Parameters(Query)

```ts
// Date in format yyyy-MM-dd
date?: string
```

#### Responses

- 200 Get topic successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    // 
    //         [en] Rating score (1-5 stars), default value is 0 (unrated)
    //         [ko] 별점 점수 (1-5점), 기본값은 0이다. (평가하지 않음)
    //     
    rate: integer
    data: string
    createdAt: string
    updatedAt: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
      createdAt: string
      updatedAt: string
    }[]
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/topic/feedback/{topicFeedbackId}

- Summary  
Get feedback topic

- Description  
  
        [en] Retrieves detailed information about a specific feedback topic, including AI feedback content and user comments  
        [ko] 특정 피드백 기록의 상세 정보를 조회합니다. AI 피드백 내용과 사용자 댓글을 포함합니다.  
    

#### Responses

- 200 Get feedback topic successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
    createdAt: string
    updatedAt: string
  }
}
```

- 401 Unauthorized

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Feedback topic not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 409 AI feedback is still processing

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 AI feedback processing error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/records/me

- Summary  
[en] Get record by date  
[ko] 날짜별 기록 조회

- Description  
[en] Get a user's record for a specific date  
[ko] 특정 날짜의 사용자 기록을 조회합니다

#### Parameters(Query)

```ts
// [en] Date in format yyyy-MM-dd
// [ko] 날짜 형식 yyyy-MM-dd
date: string
```

#### Responses

- 200 [en] Successfully retrieved record
[ko] 기록 조회 성공

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 403 [en] Unauthorized access
[ko] 권한 없음

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 [en] Record not found
[ko] 기록을 찾을 수 없음

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/quests/quote

- Summary  
Get random life quote

- Description  
  
            [en] Get a random life quote from the database.  
            AccessToken is required on Authorization header.  
              
            [ko] 데이터베이스에서 랜덤한 명언을 조회합니다.  
            Authorization 헤더에 AccessToken이 필요합니다.  
        

#### Responses

- 200 return life quotes successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data?: string
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    name: string
    description: string
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    progress: integer
    target: integer
    status: enum[COMPLETED, INCOMPLETE, PROCESSING]
    step: integer
    createdAt: string
    updatedAt: string
    photo?: string
  }[]
}
```

- 403 Invalid request

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    name: string
    description: string
    target: integer
    step: integer
    createdAt: string
    updatedAt: string
  }[]
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/quests/list/{type}

- Summary  
List quests by type

- Description  
  
           [en] Get a list of quests filtered by type.  
           AccessToken is required for all of this part of endpoints on Authorization header.  
             
           [ko] 유형별로 필터링된 퀘스트 목록을 가져옵니다.  
           모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

#### Responses

- 200 Successfully retrieved filtered quests list

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    name: string
    description: string
    target: integer
    step: integer
    createdAt: string
    updatedAt: string
  }[]
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/quests/list/{type}/{step}

- Summary  
List quests by type and step

- Description  
  
            [en] Get a list of quests filtered by type and step number.  
            AccessToken is required for all of this part of endpoints on Authorization header.  
              
            [ko] 유형과 단계 번호로 필터링된 퀘스트 목록을 가져옵니다.  
            모든 엔드포인트는 Authorization 헤더에 AccessToken이 필요합니다.  
        

#### Responses

- 200 Successfully retrieved filtered quests list

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    name: string
    description: string
    target: integer
    step: integer
    createdAt: string
    updatedAt: string
  }
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/quests/last

- Summary  
Get current quests

- Description  
  
            [en] Get all current quests in progress.  
            AccessToken is required on Authorization header.  
              
            [ko] 현재 진행 중인 모든 퀘스트를 가져옵니다.  
            Authorization 헤더에 AccessToken이 필요합니다.  
        

#### Responses

- 200 Successfully retrieved current quests

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
  }
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/quests/last/{type}

- Summary  
Get current quest by type

- Description  
  
            [en] Get current quest in progress for specific type.  
            AccessToken is required on Authorization header.  
              
            [ko] 특정 타입의 현재 진행 중인 퀘스트를 가져옵니다.  
            Authorization 헤더에 AccessToken이 필요합니다.  
        

#### Responses

- 200 Successfully retrieved current quest

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    name: string
    description: string
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    progress: integer
    target: integer
    status: enum[COMPLETED, INCOMPLETE, PROCESSING]
    step: integer
    createdAt: string
    updatedAt: string
    photo?: string
  }
}
```

- 403 Unauthorized access

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 No current quest found for given type

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/pot/status

- Summary  
[en] get pot status [ko] 화분 상태 조회

- Description  
  
        [en]  
        Retrieves the current status of user's plant pot including level, experience points, and coupon count.  
        This endpoint is protected and requires authentication.  
          
        [ko]  
        사용자 화분의 현재 상태(레벨, 경험치, 쿠폰 개수 등)를 조회합니다.  
        이 엔드포인트는 보호되어 있으며 사용을 위해서 accessToken이 필요합니다.  
    

#### Responses

- 200 get pot status successfully

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    level: integer
    exp: integer
    need: integer
    coupon: integer
  }
}
```

- 403 Unauthorized access

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 pot not found

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/etc/behavior

- Summary  
[En] Get User behavior information by date / [Kr] 특정 날짜의 사용자 활동 정보 조회

- Description  
  
            [En] Returns a list of user activities including diagnosis tests, diaries and quests completed on a specific date.  
            The date parameter should be in yyyy-MM-dd format.  
            [Kr] 특정 날짜에 수행한 검사, 일기 작성, 퀘스트 완료 등의 사용자 활동 목록을 반환합니다.  
            날짜 파라미터는 yyyy-MM-dd 형식이어야 합니다.  
        

#### Parameters(Query)

```ts
date: string
```

#### Responses

- 200 
                    [En] Successfully retrieved user behavior information for the specified date
                    [Kr] 지정된 날짜의 사용자 활동 정보를 성공적으로 조회했습니다
                

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    title: string
    content: string
    type: enum[DIARY, QUEST, DIAGNOSIS]
  }[]
}
```

- 403 
                    [En] Unauthorized access - Valid authentication token required
                    [Kr] 인증되지 않은 접근 - 유효한 인증 토큰이 필요합니다
                

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/etc/behavior/summary

- Summary  
[En] Get User behavior summary by month / [Kr] 월별 사용자 활동 요약 조회

- Description  
  
            [En] Returns a list of dates in the specified month where the user had any activity (diagnosis tests or diary entries).  
            The date parameter should be in yyyy-MM format.  
            [Kr] 지정된 달에 사용자가 활동(검사 또는 일기 작성)을 한 날짜 목록을 반환합니다.  
            날짜 파라미터는 yyyy-MM 형식이어야 합니다.  
        

#### Parameters(Query)

```ts
date: string
```

#### Responses

- 200 
                    [En] Successfully retrieved user behavior summary for the specified month
                    [Kr] 지정된 월의 사용자 활동 요약을 성공적으로 조회했습니다
                

`*/*`

```ts
{
  error: boolean
  message: string
  code: integer
  data?: string[]
}
```

- 403 
                    [En] Unauthorized access - Valid authentication token required
                    [Kr] 인증되지 않은 접근 - 유효한 인증 토큰이 필요합니다
                

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

***

### [GET]/diagnosis/{id}

- Summary  
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
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[Simple, PHQ-9, GAD-7, BDI]
    title: string
    description: string
    questions: {
      seq: integer
      text: string
      answers: {
        text: string
        score: integer
      }[]
    }[]
    scale: {
      start: integer
      scaleName: string
      description: string
    }[]
    createdAt: string
    updatedAt: string
  }
}
```

- 401 Unauthorized - Invalid or missing JWT token

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
}
```

- 404 Diagnosis not found

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    diagnosisId: integer
    result: integer
    scale: integer
    createdAt: string
    updatedAt: string
  }[]
}
```

- 401 Unauthorized - Invalid or missing JWT token

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[Simple, PHQ-9, GAD-7, BDI]
    title: string
    description: string
    questions: {
      seq: integer
      text: string
      answers: {
        text: string
        score: integer
      }[]
    }[]
    scale: {
      start: integer
      scaleName: string
      description: string
    }[]
    createdAt: string
    updatedAt: string
  }[]
}
```

- 401 Unauthorized - Invalid or missing JWT token

`application/json`

```ts
{
  error: boolean
  message: string
  code: integer
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
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    email: string
    roles?: string[]
    username: string
    gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate: string
    createdAt: string
    updatedAt: string
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

***

### [GET]/admin/export/{className}

#### Parameters(Query)

```ts
query?: string
```

```ts
format: string
```

```ts
raw?: boolean
```

```ts
otherParams: {
  all: {
  }
  empty?: boolean
}
```

#### Responses

- 200 OK

`*/*`

```ts
{
  "type": "string",
  "format": "byte"
}
```

***

### [GET]/admin/download/{className}/{fieldName}/{id}

#### Responses

- 200 OK

`*/*`

```ts
{
  "type": "string",
  "format": "byte"
}
```

***

### [GET]/admin/download/{className}/{fieldName}/{id}/image

#### Responses

- 200 OK

`image/jpeg`

```ts
{
  "type": "string",
  "format": "byte"
}
```

***

### [GET]/admin/api/autocomplete/{className}

#### Parameters(Query)

```ts
query: string
```

#### Responses

- 200 OK

`*/*`

```ts
{}
```

## References

### #/components/schemas/TopicFeedbackRequest

```ts
{
  data: string
}
```

### #/components/schemas/ApiResponseDTO

```ts
{
  error: boolean
  message: string
  code: integer
}
```

### #/components/schemas/ApiResponseDTOString

```ts
{
  error: boolean
  message: string
  code: integer
  data?: string
}
```

### #/components/schemas/ApiResponseDTOTopicDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    // 
    //         [en] Rating score (1-5 stars), default value is 0 (unrated)
    //         [ko] 별점 점수 (1-5점), 기본값은 0이다. (평가하지 않음)
    //     
    rate: integer
    data: string
    createdAt: string
    updatedAt: string
    feedbacks: {
      id?: string
      aiFeedback?: string
      comment?: string
      data?: string
      status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
      createdAt: string
      updatedAt: string
    }[]
  }
}
```

### #/components/schemas/TopicDTO

```ts
{
  id: string
  // 
  //         [en] Rating score (1-5 stars), default value is 0 (unrated)
  //         [ko] 별점 점수 (1-5점), 기본값은 0이다. (평가하지 않음)
  //     
  rate: integer
  data: string
  createdAt: string
  updatedAt: string
  feedbacks: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
    createdAt: string
    updatedAt: string
  }[]
}
```

### #/components/schemas/TopicFeedbackDTO

```ts
{
  id?: string
  aiFeedback?: string
  comment?: string
  data?: string
  status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
  createdAt: string
  updatedAt: string
}
```

### #/components/schemas/CreateRecordRequest

```ts
{
  data: string
}
```

### #/components/schemas/ApiResponseDTORecordDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    rate: integer
    data: string
    luckyVicky: string
    comment: string
    status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
    createdAt: string
    updatedAt: string
  }
}
```

### #/components/schemas/RecordDTO

```ts
{
  id: string
  rate: integer
  data: string
  luckyVicky: string
  comment: string
  status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
  createdAt: string
  updatedAt: string
}
```

### #/components/schemas/CreateQuestRequest

```ts
{
  id: integer
}
```

### #/components/schemas/ApiResponseDTOUserQuestsDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    name: string
    description: string
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    progress: integer
    target: integer
    status: enum[COMPLETED, INCOMPLETE, PROCESSING]
    step: integer
    createdAt: string
    updatedAt: string
    photo?: string
  }
}
```

### #/components/schemas/UserQuestsDTO

```ts
{
  id: string
  name: string
  description: string
  type: enum[MEDITATE, ACTIVITY, EMOTION]
  progress: integer
  target: integer
  status: enum[COMPLETED, INCOMPLETE, PROCESSING]
  step: integer
  createdAt: string
  updatedAt: string
  photo?: string
}
```

### #/components/schemas/DiagnosisResultSubmitRequest

```ts
{
  id: integer
  result: integer
  scale: integer
}
```

### #/components/schemas/ApiResponseDTODiagnosisResultDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    diagnosisId: integer
    result: integer
    scale: integer
    createdAt: string
    updatedAt: string
  }
}
```

### #/components/schemas/DiagnosisResultDTO

```ts
{
  id: string
  diagnosisId: integer
  result: integer
  scale: integer
  createdAt: string
  updatedAt: string
}
```

### #/components/schemas/ApiResponseDTOUserInfoDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    email: string
    roles?: string[]
    username: string
    gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate: string
    createdAt: string
    updatedAt: string
    profile?: string
  }
}
```

### #/components/schemas/UserInfoDTO

```ts
{
  id: string
  email: string
  roles?: string[]
  username: string
  gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  birthDate: string
  createdAt: string
  updatedAt: string
  profile?: string
}
```

### #/components/schemas/TopicUpdateRequest

```ts
{
  // 
  //         [en] Rating score (1-5 stars)
  //         [ko] 별점 점수 (1-5점)
  //     
  rate: integer
  data: string
}
```

### #/components/schemas/UpdateFeedbackRequest

```ts
{
  // User comment for the feedback
  comment: string
  // 
  //         [en] Rating score (1-5 stars)
  //         [ko] 별점 점수 (1-5점)
  //     
  rate: integer
}
```

### #/components/schemas/RecordUpdateRequest

```ts
{
  rate: integer
  comment: string
}
```

### #/components/schemas/UpdateQuestRequest

```ts
{
  id: string
  current: integer
  status: enum[COMPLETED, INCOMPLETE, PROCESSING]
}
```

### #/components/schemas/ApiResponseDTOPotStatusDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    level: integer
    exp: integer
    need: integer
    coupon: integer
  }
}
```

### #/components/schemas/PotStatusDTO

```ts
{
  level: integer
  exp: integer
  need: integer
  coupon: integer
}
```

### #/components/schemas/UpdateUserRequest

```ts
{
  user_name?: string
  password?: string
  gender?: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  // Birth date in format yyyy-MM-dd
  birth_date?: string
}
```

### #/components/schemas/ApiResponseDTOUpdateUserResponse

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    email: string
    userName: string
    gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
    birthDate: string
  }
}
```

### #/components/schemas/UpdateUserResponse

```ts
{
  email: string
  userName: string
  gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  birthDate: string
}
```

### #/components/schemas/SignUpRequest

```ts
{
  user_name: string
  email: string
  password: string
  gender: enum[MALE, FEMALE, THIRD_GENDER, UNKNOWN]
  // Birth date in format yyyy-MM-dd
  birth_date: string
}
```

### #/components/schemas/ApiResponseDTOSignUpResponse

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    accessToken: string
    refreshToken: string
  }
}
```

### #/components/schemas/SignUpResponse

```ts
{
  accessToken: string
  refreshToken: string
}
```

### #/components/schemas/TokenRefreshRequest

```ts
{
  refreshToken: string
}
```

### #/components/schemas/ApiResponseDTOTokenRefreshResponse

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    accessToken: string
    refreshToken: string
  }
}
```

### #/components/schemas/TokenRefreshResponse

```ts
{
  accessToken: string
  refreshToken: string
}
```

### #/components/schemas/LogoutRequest

```ts
{
  accessToken: string
  refreshToken: string
}
```

### #/components/schemas/LoginRequest

```ts
{
  email: string
  password: string
}
```

### #/components/schemas/ApiResponseDTOLoginResponse

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    accessToken: string
    refreshToken: string
  }
}
```

### #/components/schemas/LoginResponse

```ts
{
  accessToken: string
  refreshToken: string
}
```

### #/components/schemas/ApiResponseDTOListTopicFeedbackDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
    createdAt: string
    updatedAt: string
  }[]
}
```

### #/components/schemas/ApiResponseDTOTopicFeedbackDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id?: string
    aiFeedback?: string
    comment?: string
    data?: string
    status: enum[QUEUED, PROCESSING, COMPLETED, NOFEEDBACK, PROCESSING_ERROR]
    createdAt: string
    updatedAt: string
  }
}
```

### #/components/schemas/ApiResponseDTOListUserQuestStagesDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    stage: integer
    createdAt: string
    updatedAt: string
  }[]
}
```

### #/components/schemas/UserQuestStagesDTO

```ts
{
  id: integer
  type: enum[MEDITATE, ACTIVITY, EMOTION]
  stage: integer
  createdAt: string
  updatedAt: string
}
```

### #/components/schemas/ApiResponseDTOInteger

```ts
{
  error: boolean
  message: string
  code: integer
  data?: integer
}
```

### #/components/schemas/ApiResponseDTOListUserQuestsDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    name: string
    description: string
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    progress: integer
    target: integer
    status: enum[COMPLETED, INCOMPLETE, PROCESSING]
    step: integer
    createdAt: string
    updatedAt: string
    photo?: string
  }[]
}
```

### #/components/schemas/ApiResponseDTOListQuestsDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    name: string
    description: string
    target: integer
    step: integer
    createdAt: string
    updatedAt: string
  }[]
}
```

### #/components/schemas/QuestsDTO

```ts
{
  id: integer
  type: enum[MEDITATE, ACTIVITY, EMOTION]
  name: string
  description: string
  target: integer
  step: integer
  createdAt: string
  updatedAt: string
}
```

### #/components/schemas/ApiResponseDTOQuestsDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[MEDITATE, ACTIVITY, EMOTION]
    name: string
    description: string
    target: integer
    step: integer
    createdAt: string
    updatedAt: string
  }
}
```

### #/components/schemas/ApiResponseDTOMapQuestTypeUserQuestsDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
  }
}
```

### #/components/schemas/ApiResponseDTOListDailyBehaviorDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    title: string
    content: string
    type: enum[DIARY, QUEST, DIAGNOSIS]
  }[]
}
```

### #/components/schemas/DailyBehaviorDTO

```ts
{
  title: string
  content: string
  type: enum[DIARY, QUEST, DIAGNOSIS]
}
```

### #/components/schemas/ApiResponseDTOListString

```ts
{
  error: boolean
  message: string
  code: integer
  data?: string[]
}
```

### #/components/schemas/ApiResponseDTODiagnosisDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[Simple, PHQ-9, GAD-7, BDI]
    title: string
    description: string
    questions: {
      seq: integer
      text: string
      answers: {
        text: string
        score: integer
      }[]
    }[]
    scale: {
      start: integer
      scaleName: string
      description: string
    }[]
    createdAt: string
    updatedAt: string
  }
}
```

### #/components/schemas/DiagnosisDTO

```ts
{
  id: integer
  type: enum[Simple, PHQ-9, GAD-7, BDI]
  title: string
  description: string
  questions: {
    seq: integer
    text: string
    answers: {
      text: string
      score: integer
    }[]
  }[]
  scale: {
    start: integer
    scaleName: string
    description: string
  }[]
  createdAt: string
  updatedAt: string
}
```

### #/components/schemas/DiagnosisQuestionDTO

```ts
{
  seq: integer
  text: string
  answers: {
    text: string
    score: integer
  }[]
}
```

### #/components/schemas/DiagnosisScaleDTO

```ts
{
  start: integer
  scaleName: string
  description: string
}
```

### #/components/schemas/DiagnosisTextDTO

```ts
{
  text: string
  score: integer
}
```

### #/components/schemas/ApiResponseDTOListDiagnosisResultDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: string
    diagnosisId: integer
    result: integer
    scale: integer
    createdAt: string
    updatedAt: string
  }[]
}
```

### #/components/schemas/ApiResponseDTOListDiagnosisDTO

```ts
{
  error: boolean
  message: string
  code: integer
  data: {
    id: integer
    type: enum[Simple, PHQ-9, GAD-7, BDI]
    title: string
    description: string
    questions: {
      seq: integer
      text: string
      answers: {
        text: string
        score: integer
      }[]
    }[]
    scale: {
      start: integer
      scaleName: string
      description: string
    }[]
    createdAt: string
    updatedAt: string
  }[]
}
```

### #/components/schemas/MultiValueMapStringString

```ts
{
  all: {
  }
  empty?: boolean
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
