### Step 6: Authentication

**Options**:

- JWT (JSON Web Tokens)
- OAuth 2.0
- API Keys
- Session-based

**Example with JWT**:

```
GET /api/v1/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 7: Versioning

**URL versioning** (recommended):

```
/api/v1/users
/api/v2/users
```

**Header versioning**:

```
GET /api/users
Accept: application/vnd.api+json; version=1
```

### Step 8: Documentation

Create OpenAPI 3.0 specification:

```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
  description: API for managing users
servers:
  - url: https://api.example.com/v1
paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreate'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
          format: email
        created_at:
          type: string
          format: date-time
    UserCreate:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
        email:
          type: string
          format: email
```

## Best practices

1. **Consistency**: Use consistent naming, structure, and patterns
2. **Versioning**: Always version your APIs from the start
3. **Security**: Implement authentication and authorization
4. **Validation**: Validate all inputs on the server side
5. **Rate limiting**: Protect against abuse
6. **Caching**: Use ETags and Cache-Control headers
7. **CORS**: Configure properly for web clients
8. **Documentation**: Keep docs up-to-date with code
9. **Testing**: Test all endpoints thoroughly
10. **Monitoring**: Log requests and track performance

## Common patterns

**Filtering**:

```
GET /api/v1/users?role=admin&status=active
```

**Sorting**:

```
GET /api/v1/users?sort=-created_at,name
```

**Field selection**:

```
GET /api/v1/users?fields=id,name,email
```

**Batch operations**:

```
POST /api/v1/users/batch
{
  "operations": [
    {"action": "create", "data": {...}},
    {"action": "update", "id": 123, "data": {...}}
  ]
}
```

## GraphQL alternative

If REST doesn't fit, consider GraphQL:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Query {
  users(page: Int, limit: Int): [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

## References

- [OpenAPI Specification](https://swagger.io/specification/)
- [REST API Tutorial](https://restfulapi.net/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [HTTP Status Codes](https://httpstatuses.com/)

## Examples

### Example 1: Basic usage

<!-- Add example content here -->

### Example 2: Advanced usage

<!-- Add advanced example content here -->
