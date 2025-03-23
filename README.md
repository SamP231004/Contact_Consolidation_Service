# Contact Consolidation Service 🕵️‍♂️

A sophisticated contact management system that consolidates user information across multiple interactions. 🔄

## Features 🌟

- **Contact Identification** 🎯
  - Process email and phone number combinations
  - Automatically link related contacts
  - Maintain primary and secondary contact relationships

- **Smart Consolidation** 🧠
  - Identify duplicate contacts
  - Merge contact information
  - Preserve contact history

- **Robust API** 💪
  - RESTful endpoints
  - JSON payloads
  - Comprehensive error handling

## Tech Stack 🛠️

- Node.js
- Express.js
- MongoDB
- Mongoose
- Postman (Testing)

## Getting Started 🚀

### Prerequisites 📋

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation 💻

1. Clone the repository
```bash
git clone https://github.com/SamP231004/Contact_Consolidation_Service
cd Contact_Consolidation_Service
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
PORT=
MONGODB_URI=
```

4. Start the server
```bash
npm run dev  # for development
npm start    # for production
```

## API Documentation 📚

### POST /identify

Identifies and consolidates contact information.

#### Test Cases and Expected Responses

1. **Basic Contact Creation** ✨
```json
Request:
{
    "email": "test@example.com",
    "phoneNumber": "1234567890"
}

Response:
{
    "contact": {
        "primaryContactId": "<id>",
        "emails": ["test@example.com"],
        "phoneNumbers": ["1234567890"],
        "secondaryContactIds": []
    }
}
```

2. **Matching Email, Different Phone** 📱
```json
Request:
{
    "email": "test@example.com",
    "phoneNumber": "9999999999"
}

Response:
{
    "contact": {
        "primaryContactId": "<id>",
        "emails": ["test@example.com"],
        "phoneNumbers": ["1234567890", "9999999999"],
        "secondaryContactIds": ["<secondary_id>"]
    }
}
```

3. **Matching Phone, Different Email** 📧
```json
Request:
{
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890"
}

Response:
{
    "contact": {
        "primaryContactId": "<id>",
        "emails": ["test@example.com", "john.doe@example.com"],
        "phoneNumbers": ["1234567890"],
        "secondaryContactIds": ["<secondary_id>"]
    }
}
```

4. **Invalid Request** ⚠️
```json
Request:
{}

Response:
{
    "error": "Bad Request",
    "message": "Email or phone number is required"
}
```

## Database Schema 📐

```javascript
Contact {
    phoneNumber: String,
    email: String,
    linkedId: ObjectId,
    linkPrecedence: "primary" | "secondary",
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime
}
```

## Performance Optimizations 🚄

- Indexed queries for faster lookups
- Efficient contact linking algorithm
- Optimized database schema

## Error Handling 🛡️

- Input validation
- Data sanitization
- Error message obfuscation