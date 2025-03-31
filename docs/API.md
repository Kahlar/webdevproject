# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API uses a simple authentication system. All requests should include the user's session token in the Authorization header.

## Endpoints

### Forum Posts

#### Get Forum Posts
```http
GET /api/forum
```

Query Parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of posts per page (default: 10)

Response:
```json
{
  "posts": [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "authorName": "string",
      "authorId": "string",
      "likes": number,
      "dislikes": number,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "total": number,
  "page": number,
  "totalPages": number
}
```

#### Create Forum Post
```http
POST /api/forum
```

Request Body:
```json
{
  "title": "string",
  "content": "string",
  "authorName": "string"
}
```

Response:
```json
{
  "_id": "string",
  "title": "string",
  "content": "string",
  "authorName": "string",
  "authorId": "string",
  "likes": number,
  "dislikes": number,
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Eco Tips

#### Get Eco Tips
```http
GET /api/tips
```

Query Parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of tips per page (default: 10)

Response:
```json
{
  "tips": [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "category": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "total": number,
  "page": number,
  "totalPages": number
}
```

#### Create Eco Tip
```http
POST /api/tips
```

Request Body:
```json
{
  "title": "string",
  "content": "string",
  "category": "string"
}
```

### Carbon Calculator

#### Calculate Carbon Footprint
```http
POST /api/carbon/calculate
```

Request Body:
```json
{
  "transportation": {
    "car": number,
    "bus": number,
    "train": number,
    "plane": number
  },
  "energy": {
    "electricity": number,
    "gas": number,
    "water": number
  },
  "waste": {
    "recycling": number,
    "landfill": number
  }
}
```

Response:
```json
{
  "totalEmissions": number,
  "breakdown": {
    "transportation": number,
    "energy": number,
    "waste": number
  },
  "recommendations": [
    {
      "category": "string",
      "suggestion": "string",
      "potentialReduction": number
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string",
  "details": "string"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "string"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "string"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. The current limits are:
- 100 requests per minute per IP address
- 1000 requests per hour per user

When rate limit is exceeded, the API will return a 429 Too Many Requests response:
```json
{
  "error": "Too many requests",
  "retryAfter": number
}
``` 