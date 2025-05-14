# API Documentation

## Auth Endpoints

### Register
- **Method:** POST
- **Path:** `/user/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Login
- **Method:** POST
- **Path:** `/user/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Refresh Token
- **Method:** POST
- **Path:** `/user/refresh`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "refresh_token": "string"
  }
  ```

### Get User Info
- **Method:** GET
- **Path:** `/user/me`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`

## Notes Endpoints

### Get Public Note
- **Method:** GET
- **Path:** `/public/{id}`
- **Auth Required:** No
- **URL Params:** `id=[string]`

### Create Note
- **Method:** POST
- **Path:** `/note/create`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`

### Get Note
- **Method:** GET
- **Path:** `/note/{id}`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Get User Notes
- **Method:** GET
- **Path:** `/note/list`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`

### Update Full Note
- **Method:** PUT
- **Path:** `/note/{id}`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Update Note Title
- **Method:** PATCH
- **Path:** `/note/{id}`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Update Note Order
- **Method:** PATCH
- **Path:** `/note/{id}/order`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Make Note Public
- **Method:** PATCH
- **Path:** `/note/{id}/public`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Make Note Private
- **Method:** PATCH
- **Path:** `/note/{id}/private`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Archive Note
- **Method:** PATCH
- **Path:** `/note/{id}/archive`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Unarchive Note
- **Method:** PATCH
- **Path:** `/note/{id}/unarchive`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Delete Note
- **Method:** DELETE
- **Path:** `/note/{id}`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

## Note Nodes Endpoints

### Add Node
- **Method:** POST
- **Path:** `/node`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`

### Get Node Image
- **Method:** GET
- **Path:** `/node/{id}/image`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Update Node Content
- **Method:** PATCH
- **Path:** `/node/{id}`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`

### Upload Node Image
- **Method:** PATCH
- **Path:** `/node/{id}/image`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]`
- **Content-Type:** `multipart/form-data`

### Delete Node
- **Method:** DELETE
- **Path:** `/node/{id}`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`
- **URL Params:** `id=[string]` 