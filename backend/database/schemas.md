# Database Schemas

## Collections Structure

### 1. templates
```json
{
  "name": "Function Templates",
  "attributes": [
    {
      "key": "title",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "description",
      "type": "string",
      "size": 1000,
      "required": true
    },
    {
      "key": "category",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "tags",
      "type": "string",
      "size": 500,
      "array": true
    },
    {
      "key": "runtime",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "version",
      "type": "string",
      "size": 20,
      "required": true
    },
    {
      "key": "author_id",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "source_code_url",
      "type": "string",
      "size": 500,
      "required": true
    },
    {
      "key": "dependencies",
      "type": "string",
      "size": 2000
    },
    {
      "key": "environment_variables",
      "type": "string",
      "size": 2000
    },
    {
      "key": "download_count",
      "type": "integer",
      "default": 0
    },
    {
      "key": "rating_average",
      "type": "double",
      "default": 0
    },
    {
      "key": "rating_count",
      "type": "integer",
      "default": 0
    },
    {
      "key": "is_verified",
      "type": "boolean",
      "default": false
    },
    {
      "key": "is_featured",
      "type": "boolean",
      "default": false
    }
  ]
}
```

### 2. deployments
```json
{
  "name": "Function Deployments",
  "attributes": [
    {
      "key": "template_id",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "user_id",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "appwrite_function_id",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "deployment_status",
      "type": "string",
      "size": 20,
      "required": true
    },
    {
      "key": "deployment_logs",
      "type": "string",
      "size": 5000
    },
    {
      "key": "execution_count",
      "type": "integer",
      "default": 0
    },
    {
      "key": "last_execution",
      "type": "datetime"
    },
    {
      "key": "performance_metrics",
      "type": "string",
      "size": 2000
    }
  ]
}
```

### 3. reviews
```json
{
  "name": "Template Reviews",
  "attributes": [
    {
      "key": "template_id",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "user_id",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "rating",
      "type": "integer",
      "min": 1,
      "max": 5,
      "required": true
    },
    {
      "key": "comment",
      "type": "string",
      "size": 1000
    },
    {
      "key": "is_helpful_count",
      "type": "integer",
      "default": 0
    }
  ]
}
```

### 4. categories
```json
{
  "name": "Template Categories",
  "attributes": [
    {
      "key": "name",
      "type": "string",
      "size": 100,
      "required": true
    },
    {
      "key": "description",
      "type": "string",
      "size": 500
    },
    {
      "key": "icon",
      "type": "string",
      "size": 100
    },
    {
      "key": "template_count",
      "type": "integer",
      "default": 0
    }
  ]
}
```

### 5. user_profiles
```json
{
  "name": "User Profiles",
  "attributes": [
    {
      "key": "user_id",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "display_name",
      "type": "string",
      "size": 100
    },
    {
      "key": "bio",
      "type": "string",
      "size": 500
    },
    {
      "key": "github_username",
      "type": "string",
      "size": 100
    },
    {
      "key": "website",
      "type": "string",
      "size": 200
    },
    {
      "key": "templates_contributed",
      "type": "integer",
      "default": 0
    },
    {
      "key": "total_downloads",
      "type": "integer",
      "default": 0
    },
    {
      "key": "reputation_score",
      "type": "integer",
      "default": 0
    }
  ]
}
```

## Indexes

### templates
- `category` (ascending)
- `rating_average` (descending)
- `download_count` (descending)
- `created_at` (descending)
- `author_id` (ascending)

### deployments
- `user_id` (ascending)
- `template_id` (ascending)
- `deployment_status` (ascending)

### reviews
- `template_id` (ascending)
- `user_id` (ascending)
- `rating` (descending)