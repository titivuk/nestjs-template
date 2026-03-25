---
name: api-design
description: REST API design patterns including resource naming, status codes, pagination filtering, error responses
---

# API Design

## When to use this skill

- Designing new REST APIs
- Refactoring, reviewing or documenting existing API endpoints
- Adding pagination, filtering or sorting
- Implementing API error handling
- Implementing API validation
- Defining API contracts

## Instructions

### URL Structure

- Add versioned prefix: `api/v1`. Ask if not sure which version should be used

```
GET /api/v1/...
```

- Use nouns, plural, lowercase, kebab-case

```
# GOOD
GET /api/v1/users
GET /api/v1/users/:id
POST /api/v1/users
PUT /api/v1/users/:id
DELETE /api/v1/users/:id

# BAD
GET /api/v1/getUsers
GET /api/v1/get_users
```

- Actions that do not map to CRUD can use verbs (use sparingly and communicate it)

```
POST /api/v1/orders/:id/cancel
POST /api/v1/auth/login
POST /api/v1/auth/logout
```

### HTTP Methods

- `GET` - retrieve resources
- `POST` - create new resource or perform an action that is not mapped to CRUD
- `PUT` - replace entire resource
- `PATCH` - partial update of a resource
- `DELETE` - idempotent remove

### HTTP Status Codes

- `200 OK` - success with response body (GET, PUT, PATCH, sometimes POST if it is not resource creation)
- `201 Created` - Resource created (POST)
- `202 Accepted` - request accepted but the result is not ready yet (most likely POST)
- `204 No Content` - no response body (DELETE)
- `400 Bad Request` - Validation failed or request cannot be performed due to invalid state
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource conflict
- `500 Internal Server Error` - Server error (never expose details)

### Response Format

Response can be two types: successful and error

Successful response is a raw data not wrapped into any object

```json
{ "id": "...", "name": "..." } // actual data
```

Error response has the following structure

```json
{
  "code": "STATIC_SCREAMING_CASE_ERROR_CODE", // required, error code
  "title": "Human readable summary of the problem type", // optional, should not change from occurrence to occurrence of the problem
  // optional, extension to existing fields
  "errors": [
    {
      "field": "email",
      "detail": "Invalid email format"
    }
  ]
}
```

- validation error

```json
{
  "code": "VALIDATION_ERROR",
  "title": "Invalid input",
  "errors": [
    {
      "field": "email",
      "detail": "Invalid email format"
    }
  ]
}
```

- unknown error

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "title": "Something unexpected happened"
}
```

- business error

```json
{
  "code": "SUBSCRIPTION_EXPIRED",
  "title": "Subscription has expired"
}
```

### Pagination

Use offset-based approach.

- pass request pagination data via URL query

```
GET /api/v1/users?page=2&perPage=20
```

- use the following response format

```json
{
  "page": 2,
  "perPage": 20,
  "total": 100,
  "totalPages": 5,
  "data": [1, 2, 3]
}
```

## Additional resources

- For NestJS, see [NestJS API Design](references/nestjs-api-design.md)
