# Student Management CRUD REST API

A beginner-friendly REST API for managing student records. It demonstrates the core building blocks of a Node.js backend: Express routing, MVC separation, Mongoose models, validation, MongoDB persistence, pagination, search, and centralized error handling.

No authentication, authorization, or frontend is included. The project is intentionally focused on learning Express.js and MongoDB CRUD operations.

---

## 1. Introduction

This API lets you:

- Create a student
- List all students with pagination
- Search students by name
- Get a single student by ID
- Update a student
- Delete a student

Every response uses a consistent JSON structure, and every error is handled by reusable middleware.

---

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| Node.js 18+ (tested with Node.js 22 LTS) | JavaScript runtime |
| Express.js | Web framework and routing |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling and validation |
| JavaScript ES Modules | `import` / `export` syntax |
| dotenv | Loads environment variables from `.env` |
| cors | Allows cross-origin requests |
| nodemon | Restarts the server during development |

> Node.js 26 is not an LTS release, so this project uses the current LTS line. Any Node.js version 18 or newer works.

---

## 3. Project Structure

```text
student-crud-api/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── models/
│   │   └── student.model.js         # Mongoose schema and model
│   ├── controllers/
│   │   └── student.controller.js    # CRUD business logic
│   ├── routes/
│   │   └── student.routes.js        # API route definitions
│   ├── middlewares/
│   │   ├── asyncHandler.middleware.js # Forwards async errors to Express
│   │   ├── notFound.middleware.js   # Handles unknown routes
│   │   └── error.middleware.js      # Global error formatter
│   ├── utils/
│   │   └── ApiError.js              # Error helper with an HTTP status code
│   ├── app.js                       # Express app configuration
│   └── server.js                    # Starts the database and HTTP server
├── .env                             # Local environment variables (not committed)
├── .env.example                     # Example environment variables
├── .gitignore
├── package.json
└── README.md
```

### MVC flow

```text
Request
  -> Route (student.routes.js)
  -> Controller (student.controller.js)
  -> Model (student.model.js)
  -> MongoDB
  -> Response
```

If anything fails, the error is passed to `error.middleware.js`, which returns a consistent error response.

---

## 4. Installation

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally, in Docker/Podman, or on MongoDB Atlas

### Steps

```bash
# 1. Open the project folder
cd student-crud-api

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Start MongoDB (see the next section)

# 5. Start the development server
npm run dev
```

The API should now be available at:

```text
http://localhost:5000
```

Check it with:

```bash
curl http://localhost:5000
```

Expected response:

```json
{
  "success": true,
  "message": "Student Management API is running",
  "data": {
    "endpoints": "/api/students"
  }
}
```

---

## 5. MongoDB Setup

### Option A - Local MongoDB

If MongoDB is installed on your machine, start it:

```bash
mongod
```

The default local connection string is:

```text
mongodb://127.0.0.1:27017/student_crud
```

### Option B - Docker

```bash
docker run -d --name student-mongo -p 27017:27017 mongo:8
```

If you use Podman, the command is the same, but replace `docker` with `podman`:

```bash
podman run -d --name student-mongo -p 27017:27017 mongo:8
```

### Option C - MongoDB Atlas (cloud)

1. Create a free cluster at <https://www.mongodb.com/cloud/atlas>.
2. Create a database user and allow your IP address.
3. Copy the connection string and put it in `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/student_crud?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster-host>` with your own values. Never commit `.env` or share these credentials.

---

## 6. Environment Configuration

Create `.env` from the example file:

```bash
cp .env.example .env
```

`.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_crud
NODE_ENV=development
```

| Variable | Description |
|---|---|
| `PORT` | Port the HTTP server listens on. Default: `5000`. |
| `MONGO_URI` | MongoDB connection string. |
| `NODE_ENV` | `development` or `production`. In production, internal stack traces are not returned to clients. |

The `.env` file is listed in `.gitignore` and must not be committed.

---

## 7. How to Run the Project

### Development mode

```bash
npm run dev
```

Uses nodemon to restart the server automatically when files change.

### Production mode

```bash
npm start
```

Runs the server with plain Node.js.

Expected startup output:

```text
MongoDB connected: 127.0.0.1
Server running on http://localhost:5000
```

---

## 8. API Endpoint Documentation

Base URL:

```text
http://localhost:5000/api/students
```

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| `POST` | `/api/students` | Create a student | `201` |
| `GET` | `/api/students` | Get all students (supports search and pagination) | `200` |
| `GET` | `/api/students/:id` | Get one student by ObjectId | `200` |
| `PUT` | `/api/students/:id` | Update a student | `200` |
| `DELETE` | `/api/students/:id` | Delete a student | `200` |

### Student fields

| Field | Type | Validation |
|---|---|---|
| `name` | String | Required, at least 2 characters |
| `email` | String | Required, unique, valid email, stored lowercase |
| `age` | Number | Required, at least 1 |
| `gender` | String | Optional, must be `Male`, `Female`, or `Other` |
| `course` | String | Required |
| `isActive` | Boolean | Optional, defaults to `true` |
| `createdAt` | Date | Added automatically |
| `updatedAt` | Date | Updated automatically |

---

## 9. Response Format

### Success response

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "6ae83ae11f3756503a696dd3",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 21,
    "gender": "Male",
    "course": "Computer Science",
    "isActive": true,
    "createdAt": "2026-11-02T07:25:21.610Z",
    "updatedAt": "2026-11-02T07:25:21.610Z"
  }
}
```

### Error response

```json
{
  "success": false,
  "message": "Student not found"
}
```

### Validation error response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Age must be at least 1"
  ]
}
```

### List response with pagination

```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": {
    "students": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

---

## 10. Request Body Examples

### Create a student

`POST /api/students`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 21,
  "gender": "Male",
  "course": "Computer Science"
}
```

`isActive` is optional and defaults to `true`:

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "age": 23,
  "gender": "Female",
  "course": "Physics",
  "isActive": false
}
```

### Update a student

`PUT /api/students/:id`

You can send only the fields you want to change:

```json
{
  "age": 25,
  "course": "Software Engineering"
}
```

Or update the active status:

```json
{
  "isActive": false
}
```

Only these fields can be updated:

```text
name, email, age, gender, course, isActive
```

---

## 11. Endpoint Details

### 11.1 Create Student

```http
POST /api/students
Content-Type: application/json
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 21,
  "gender": "Male",
  "course": "Computer Science"
}
```

Success response - `201 Created`:

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "6ae83ae11f3756503a696dd3",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 21,
    "gender": "Male",
    "course": "Computer Science",
    "isActive": true,
    "createdAt": "2026-11-02T07:25:21.610Z",
    "updatedAt": "2026-11-02T07:25:21.610Z"
  }
}
```

Duplicate email response - `409 Conflict`:

```json
{
  "success": false,
  "message": "A student with this email already exists"
}
```

Missing fields response - `400 Bad Request`:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Email is required",
    "Age is required",
    "Course is required"
  ]
}
```

### 11.2 Get All Students

```http
GET /api/students
```

#### Query parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | Number | `1` | Page number (minimum 1) |
| `limit` | Number | `10` | Students per page (1-100) |
| `search` | String | none | Case-insensitive partial match on `name` |

Examples:

```http
GET /api/students
GET /api/students?page=1&limit=10
GET /api/students?search=john
GET /api/students?page=2&limit=5&search=john
```

Success response - `200 OK`:

```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": {
    "students": [
      {
        "_id": "6ae83ae11f3756503a696dd3",
        "name": "John Doe",
        "email": "john@example.com",
        "age": 21,
        "gender": "Male",
        "course": "Computer Science",
        "isActive": true,
        "createdAt": "2026-11-02T07:25:21.610Z",
        "updatedAt": "2026-11-02T07:25:21.610Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 11.3 Get Single Student

```http
GET /api/students/:id
```

Example:

```http
GET /api/students/6ae83ae11f3756503a696dd3
```

Success response - `200 OK`:

```json
{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {
    "_id": "6ae83ae11f3756503a696dd3",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 21,
    "gender": "Male",
    "course": "Computer Science",
    "isActive": true,
    "createdAt": "2026-11-02T07:25:21.610Z",
    "updatedAt": "2026-11-02T07:25:21.610Z"
  }
}
```

Invalid ObjectId response - `400 Bad Request`:

```json
{
  "success": false,
  "message": "Invalid student ID"
}
```

Student not found response - `404 Not Found`:

```json
{
  "success": false,
  "message": "Student not found"
}
```

### 11.4 Update Student

```http
PUT /api/students/:id
Content-Type: application/json
```

Request body (partial update is allowed):

```json
{
  "age": 25,
  "course": "Software Engineering"
}
```

Success response - `200 OK`:

```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "_id": "6ae83ae11f3756503a696dd3",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "gender": "Male",
    "course": "Software Engineering",
    "isActive": true,
    "createdAt": "2026-11-02T07:25:21.610Z",
    "updatedAt": "2026-11-02T07:25:21.723Z"
  }
}
```

No valid fields response - `400 Bad Request`:

```json
{
  "success": false,
  "message": "No valid fields were provided for update"
}
```

### 11.5 Delete Student

```http
DELETE /api/students/:id
```

Success response - `200 OK`:

```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "_id": "6ae83ae11f3756503a696dd3",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "gender": "Male",
    "course": "Software Engineering",
    "isActive": true,
    "createdAt": "2026-11-02T07:25:21.610Z",
    "updatedAt": "2026-11-02T07:25:21.723Z"
  }
}
```

---

## 12. HTTP Status Codes

| Code | Meaning | When it is used |
|---|---|---|
| `200` | OK | Successful GET, PUT, or DELETE |
| `201` | Created | Student created successfully |
| `400` | Bad Request | Invalid ObjectId, validation failure, invalid JSON, or no update fields |
| `404` | Not Found | Student does not exist, or the route does not exist |
| `409` | Conflict | Email already belongs to another student |
| `500` | Internal Server Error | Unexpected server or database error |

---

## 13. Postman Testing Instructions

### Step 1 - Start the API

```bash
npm run dev
```

Make sure you see both:

```text
MongoDB connected: 127.0.0.1
Server running on http://localhost:5000
```

### Step 2 - Create a Postman collection

1. Open Postman.
2. Click **New -> Collection** and name it `Student CRUD API`.
3. Add a collection variable:
   - Name: `baseUrl`
   - Value: `http://localhost:5000`
4. Add requests to the collection using the examples below.

For every request with a body:

1. Open the **Body** tab.
2. Select **raw**.
3. Choose **JSON** from the dropdown.
4. Paste the request body.

### Step 3 - Test each scenario

| # | Scenario | Method | URL | Body | Expected |
|---|---|---|---|---|---|
| 1 | Create student | `POST` | `{{baseUrl}}/api/students` | Valid student JSON | `201` |
| 2 | Get all students | `GET` | `{{baseUrl}}/api/students` | None | `200` |
| 3 | Search students | `GET` | `{{baseUrl}}/api/students?search=john` | None | `200` |
| 4 | Paginate students | `GET` | `{{baseUrl}}/api/students?page=1&limit=5` | None | `200` |
| 5 | Get student by ID | `GET` | `{{baseUrl}}/api/students/{{studentId}}` | None | `200` |
| 6 | Update student | `PUT` | `{{baseUrl}}/api/students/{{studentId}}` | `{"age": 25}` | `200` |
| 7 | Delete student | `DELETE` | `{{baseUrl}}/api/students/{{studentId}}` | None | `200` |
| 8 | Invalid ID | `GET` | `{{baseUrl}}/api/students/not-a-valid-id` | None | `400` |
| 9 | Duplicate email | `POST` | `{{baseUrl}}/api/students` | Same email as an existing student | `409` |
| 10 | Missing fields | `POST` | `{{baseUrl}}/api/students` | `{"name": "A"}` | `400` |
| 11 | Student not found | `GET` | `{{baseUrl}}/api/students/000000000000000000000000` | None | `404` |

### Step 4 - Save the created student ID automatically (optional)

In the **Tests** tab of the "Create student" request, add:

```javascript
const response = pm.response.json();

if (response.success && response.data && response.data._id) {
  pm.collectionVariables.set("studentId", response.data._id);
}
```

After sending the request, `{{studentId}}` can be used in the Get, Update, and Delete requests.

### Step 5 - Check responses

- Confirm the status code in Postman's response panel.
- Confirm the body contains `"success": true` for successful requests.
- Confirm errors contain `"success": false` and a helpful `message`.

### Postman request bodies

Create student:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 21,
  "gender": "Male",
  "course": "Computer Science"
}
```

Duplicate email test:

```json
{
  "name": "Johnny Doe",
  "email": "john@example.com",
  "age": 22,
  "course": "Mathematics"
}
```

Missing fields test:

```json
{
  "name": "A"
}
```

Update student:

```json
{
  "age": 25,
  "course": "Software Engineering"
}
```

Invalid ID test:

```text
GET http://localhost:5000/api/students/not-a-valid-id
```

Student not found test:

```text
GET http://localhost:5000/api/students/000000000000000000000000
```

> Tip: after deleting a student, sending the same DELETE request again should return `404 Student not found`.

---

## 14. Error Handling

The API uses three layers of error handling:

1. **`asyncHandler.middleware.js`** catches rejected promises from async controllers and forwards them to Express.
2. **`notFound.middleware.js`** returns a `404` for routes that do not exist.
3. **`error.middleware.js`** converts Mongoose validation errors, duplicate key errors, invalid ObjectIds, and JSON parse errors into consistent responses.

Database credentials are never included in responses or logs. In production (`NODE_ENV=production`), internal stack traces are hidden.

---

## 15. Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the server with nodemon (auto-restart on file changes) |
| `npm start` | Start the server with plain Node.js |

---

## 16. Quick Curl Examples

```bash
# Create
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":21,"gender":"Male","course":"Computer Science"}'

# Get all
curl http://localhost:5000/api/students

# Search and paginate
curl "http://localhost:5000/api/students?page=1&limit=5&search=john"

# Get one
curl http://localhost:5000/api/students/<student_id>

# Update
curl -X PUT http://localhost:5000/api/students/<student_id> \
  -H "Content-Type: application/json" \
  -d '{"age":25}'

# Delete
curl -X DELETE http://localhost:5000/api/students/<student_id>
```

---

## 17. Troubleshooting

### `MongoDB connection failed: connect ECONNREFUSED`

MongoDB is not running, or the `MONGO_URI` is wrong. Start MongoDB and check `.env`.

### `A student with this email already exists`

Emails are unique. Use a different email or update the existing student instead.

### `Invalid student ID`

The `:id` value is not a valid MongoDB ObjectId. Use the `_id` returned when the student was created.

### `Route ... not found`

The URL does not match any route. Check the method and path, for example `/api/students`.

### Port `5000` is already in use

Change `PORT` in `.env`, or stop the process using port 5000.
