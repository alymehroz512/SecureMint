# SecureMint API Testing Guide

## Overview
This guide explains how to test the SecureMint authentication API with JWT access and refresh tokens using Postman.

## Setup Instructions

### 1. Import Postman Collection
1. Open Postman
2. Click "Import" button
3. Select the `postman-collection.json` file
4. The collection will be imported with all endpoints and environment variables

### 2. Environment Variables
The collection uses these variables (automatically managed):
- `baseUrl`: http://localhost:5000/api
- `accessToken`: Automatically set after login
- `refreshToken`: Automatically set after login

### 3. Start Your Server
```bash
cd backend
npm run dev
```

## API Endpoints

### Authentication Endpoints

#### 1. Register User
- **Method**: POST
- **URL**: `/auth/register`
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```
- **Response**: Success message

#### 2. Login User
- **Method**: POST
- **URL**: `/auth/login`
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```
- **Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6...",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

#### 3. Refresh Token
- **Method**: POST
- **URL**: `/auth/refresh-token`
- **Body**:
```json
{
  "refreshToken": "{{refreshToken}}"
}
```
- **Response**: New access token

#### 4. Logout
- **Method**: POST
- **URL**: `/auth/logout`
- **Body**:
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

#### 5. Logout All Devices
- **Method**: POST
- **URL**: `/auth/logout-all`
- **Headers**: `Authorization: Bearer {{accessToken}}`

### Password Reset Endpoints

#### 1. Send OTP
- **Method**: POST
- **URL**: `/auth/send-otp`
- **Body**:
```json
{
  "email": "john.doe@example.com"
}
```

#### 2. Verify OTP
- **Method**: POST
- **URL**: `/auth/verify-otp`
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

#### 3. Reset Password
- **Method**: POST
- **URL**: `/auth/reset-password`
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123!"
}
```

### User Management Endpoints

#### 1. Get Current User
- **Method**: GET
- **URL**: `/user/me`
- **Headers**: `Authorization: Bearer {{accessToken}}`

## Testing Scenarios

### 1. Complete Authentication Flow
1. Register a new user
2. Login with credentials
3. Access protected route with access token
4. Test token refresh
5. Logout

### 2. Token Expiration Testing
1. Login to get tokens
2. Wait 15+ minutes (access token expires)
3. Try accessing protected route (should fail)
4. Use refresh token to get new access token
5. Access protected route again (should work)

### 3. Security Testing
1. Try accessing protected routes without token
2. Try with invalid/malformed tokens
3. Try using expired refresh tokens
4. Test logout functionality

### 4. Password Reset Flow
1. Send OTP to email
2. Check email for OTP code
3. Verify OTP
4. Reset password with new password
5. Login with new password

## Token Lifecycle

### Access Token
- **Lifetime**: 15 minutes
- **Purpose**: API access
- **Storage**: Frontend memory/localStorage
- **Refresh**: Automatic via refresh token

### Refresh Token
- **Lifetime**: 7 days
- **Purpose**: Generate new access tokens
- **Storage**: Database + frontend localStorage
- **Security**: Invalidated on logout

## Error Codes

### Authentication Errors
- `TOKEN_REQUIRED`: No access token provided
- `TOKEN_INVALID`: Invalid or expired access token
- `REFRESH_TOKEN_INVALID`: Invalid refresh token
- `REFRESH_TOKEN_EXPIRED`: Refresh token expired

### Common HTTP Status Codes
- `200`: Success
- `201`: Created (registration)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (no token)
- `403`: Forbidden (invalid token)
- `404`: Not Found
- `500`: Internal Server Error

## Best Practices

### For Testing
1. Always test with fresh tokens
2. Test both success and failure scenarios
3. Verify token expiration handling
4. Test concurrent sessions (multiple devices)

### For Development
1. Use environment variables for secrets
2. Implement proper error handling
3. Log security events
4. Use HTTPS in production
5. Implement rate limiting

## Troubleshooting

### Common Issues
1. **"No token provided"**: Add Authorization header
2. **"Invalid token"**: Check token format and expiration
3. **"Refresh token expired"**: Login again
4. **CORS errors**: Check server CORS configuration

### Debug Tips
1. Check server logs for detailed errors
2. Verify environment variables are set
3. Ensure MongoDB is running
4. Check email configuration for OTP