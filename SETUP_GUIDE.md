# 🚀 Quick Setup Guide - Appwrite Function Marketplace

## Step 1: Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project: **"Function Marketplace"**
3. Note your **Project ID** - you'll need this

## Step 2: Configure Database

### Create Database
1. Go to **Databases** → **Create Database**
2. Name: `marketplace`
3. Copy the **Database ID**

### Create Collections (Copy these exact schemas):

#### 1. templates
```json
{
  "name": "templates",
  "attributes": [
    {"key": "title", "type": "string", "size": 255, "required": true},
    {"key": "description", "type": "string", "size": 1000, "required": true},
    {"key": "category", "type": "string", "size": 50, "required": true},
    {"key": "tags", "type": "string", "size": 500, "array": true},
    {"key": "runtime", "type": "string", "size": 50, "required": true},
    {"key": "version", "type": "string", "size": 20, "required": true},
    {"key": "author_id", "type": "string", "size": 50, "required": true},
    {"key": "source_code_url", "type": "string", "size": 500, "required": true},
    {"key": "dependencies", "type": "string", "size": 2000},
    {"key": "environment_variables", "type": "string", "size": 2000},
    {"key": "download_count", "type": "integer", "default": 0},
    {"key": "rating_average", "type": "double", "default": 0},
    {"key": "rating_count", "type": "integer", "default": 0},
    {"key": "is_verified", "type": "boolean", "default": false},
    {"key": "is_featured", "type": "boolean", "default": false}
  ],
  "permissions": {
    "read": ["any"],
    "create": ["users"],
    "update": ["users"],
    "delete": ["users"]
  }
}
```

#### 2. deployments
```json
{
  "name": "deployments",
  "attributes": [
    {"key": "template_id", "type": "string", "size": 50, "required": true},
    {"key": "user_id", "type": "string", "size": 50, "required": true},
    {"key": "appwrite_function_id", "type": "string", "size": 50, "required": true},
    {"key": "deployment_status", "type": "string", "size": 20, "required": true},
    {"key": "deployment_logs", "type": "string", "size": 5000},
    {"key": "execution_count", "type": "integer", "default": 0},
    {"key": "last_execution", "type": "datetime"},
    {"key": "performance_metrics", "type": "string", "size": 2000}
  ],
  "permissions": {
    "read": ["users"],
    "create": ["users"],
    "update": ["users"],
    "delete": ["users"]
  }
}
```

#### 3. reviews
```json
{
  "name": "reviews",
  "attributes": [
    {"key": "template_id", "type": "string", "size": 50, "required": true},
    {"key": "user_id", "type": "string", "size": 50, "required": true},
    {"key": "rating", "type": "integer", "min": 1, "max": 5, "required": true},
    {"key": "comment", "type": "string", "size": 1000},
    {"key": "is_helpful_count", "type": "integer", "default": 0}
  ],
  "permissions": {
    "read": ["any"],
    "create": ["users"],
    "update": ["users"],
    "delete": ["users"]
  }
}
```

## Step 3: Create Storage Bucket

1. Go to **Storage** → **Create Bucket**
2. Name: `templates`
3. File Security: **Enabled**
4. Permissions:
   - Read: `any`
   - Create: `users`
   - Update: `users`
   - Delete: `users`

## Step 4: Create API Key

1. Go to **Overview** → **Integrate with your server**
2. Create API Key with these scopes:
   - `databases.read`
   - `databases.write`
   - `functions.read`
   - `functions.write`
   - `users.read`
   - `storage.read`
   - `storage.write`

## Step 5: Setup Frontend

```bash
# Clone the repository
git clone https://github.com/rough-codes/appwrite-function-marketplace
cd appwrite-function-marketplace/frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your values:
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_DATABASE_ID=your_database_id
NEXT_PUBLIC_STORAGE_BUCKET_ID=your_storage_bucket_id

# Start development server
npm run dev
```

## Step 6: Deploy Core Function

1. Go to **Functions** → **Create Function**
2. Name: `template-deployment`
3. Runtime: `Node.js 18.0`
4. Upload the code from `backend/functions/template-deployment/`
5. Set environment variables:
   ```
   APPWRITE_API_KEY=your_api_key
   DATABASE_ID=your_database_id
   STORAGE_BUCKET_ID=your_storage_bucket_id
   ```

## Step 7: Add Sample Templates

Run this script to populate with sample templates:

```javascript
// Add this to your frontend and run once
const sampleTemplates = [
  {
    title: "Email Verification",
    description: "Send branded email verification with custom templates",
    category: "Authentication",
    tags: ["email", "auth", "verification"],
    runtime: "node-18.0",
    version: "1.0.0",
    author_id: "marketplace",
    source_code_url: "auth-email-verification",
    is_featured: true,
    rating_average: 4.8,
    rating_count: 24
  },
  {
    title: "Stripe Webhook Handler",
    description: "Process Stripe payments and subscription events",
    category: "Payments",
    tags: ["stripe", "payments", "webhooks"],
    runtime: "node-18.0",
    version: "1.0.0",
    author_id: "marketplace",
    source_code_url: "payment-stripe-webhook",
    is_featured: true,
    rating_average: 4.9,
    rating_count: 18
  }
];

// Add to database
sampleTemplates.forEach(template => {
  databases.createDocument(DATABASE_ID, 'templates', 'unique()', template);
});
```

## 🎯 You're Ready!

Visit `http://localhost:3000` to see your marketplace!

**Next Development Steps:**
1. ✅ Basic marketplace browsing
2. 🔄 Template detail pages
3. 🔄 One-click deployment
4. 🔄 User authentication
5. 🔄 Template upload system

**Need help?** Check the detailed `HACKATHON_PLAN.md` for the complete development roadmap!