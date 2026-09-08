# HTTP Status Code Matrix

| HTTP Status | Operation | Meaning | Example |
|-------------|-----------|---------|---------|
| 200 | GET | Success | Submission status retrieved |
| 201 | POST | Created | Document submission created |
| 400 | POST | Bad Request | Required field missing |
| 401 | GET / POST | Unauthorized | Invalid or missing authentication token |
| 404 | GET | Not Found | Request ID does not exist |
| 409 | POST | Conflict | Request ID already exists |
| 500 | GET / POST | Internal Server Error | Unexpected server error |