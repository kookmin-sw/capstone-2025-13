# Wuung API Server

> Version v1.0.0

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| POST | [/daignosis/create](#postdaignosiscreate) |  |
| POST | [/auth/signup](#postauthsignup) | Sign up new user and generate new tokens |
| POST | [/auth/refresh](#postauthrefresh) | Refresh JWT tokens |
| POST | [/auth/logout](#postauthlogout) | Logout user |
| POST | [/auth/login](#postauthlogin) | Authenticate user and generate JWT tokens |
| GET | [/auth/me](#getauthme) | Get current user's information |
| GET | [/](#get) |  |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| CreateDiagnosisRequest | [#/components/schemas/CreateDiagnosisRequest](#componentsschemascreatediagnosisrequest) |  |
| CreateDiagnosisResponse | [#/components/schemas/CreateDiagnosisResponse](#componentsschemascreatediagnosisresponse) |  |
| SignUpRequest | [#/components/schemas/SignUpRequest](#componentsschemassignuprequest) |  |
| SignUpResponse | [#/components/schemas/SignUpResponse](#componentsschemassignupresponse) |  |
| TokenRefreshRequest | [#/components/schemas/TokenRefreshRequest](#componentsschemastokenrefreshrequest) |  |
| TokenRefreshResponse | [#/components/schemas/TokenRefreshResponse](#componentsschemastokenrefreshresponse) |  |
| LogoutRequest | [#/components/schemas/LogoutRequest](#componentsschemaslogoutrequest) |  |
| LoginRequest | [#/components/schemas/LoginRequest](#componentsschemasloginrequest) |  |
| LoginResponse | [#/components/schemas/LoginResponse](#componentsschemasloginresponse) |  |
| UserInfoResponse | [#/components/schemas/UserInfoResponse](#componentsschemasuserinforesponse) |  |
| api token | [#/components/securitySchemes/api token](#componentssecurityschemesapi-token) |  |

## Path Details

***

### [POST]/daignosis/create

#### RequestBody

- application/json

```ts
{
  accessToken?: string
  result?: integer
  type?: integer
  createAt?: string
}
```

#### Responses

- 200 Successfully create diagnosis

`application/json`

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

`application/json`

```ts
{
  accessToken?: string
  refreshToken?: string
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

`application/json`

```ts
{
  accessToken?: string
  refreshToken?: string
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

`application/json`

```ts
{
  accessToken?: string
  refreshToken?: string
}
```

- 400 Bad Request

`*/*`

```ts
{
  "type": "string"
}
```

- 401 Invalid credentials

`*/*`

```ts
{
  "type": "string"
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

`application/json`

```ts
{
  email?: string
  roles?: string[]
  username?: string
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
  "type": "string"
}
```

## References

### #/components/schemas/CreateDiagnosisRequest

```ts
{
  accessToken?: string
  result?: integer
  type?: integer
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

### #/components/schemas/LoginResponse

```ts
{
  accessToken?: string
  refreshToken?: string
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
  "scheme": "bearer"
}
```
