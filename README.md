# License Verification System

A simple and efficient license verification system built with Node.js and Express. This system allows you to verify licenses for Discord bots, applications, or any other software that requires license validation.

## Features

- 🔐 **Secure License Verification**: Validate license keys with proper error handling
- ⚡ **Fast Response Times**: Lightweight Express.js server for quick verification
- 🤖 **Bot Authorization**: Support for multiple bot IDs per license
- ⏰ **Expiration Management**: Automatic expiration date checking
- 🛡️ **License Status Control**: Enable/disable licenses as needed
- 📊 **Health Check Endpoint**: Monitor server status
- 🌐 **RESTful API**: Simple JSON-based API interface

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/license-system.git
   cd license-system
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure licenses** (see [Configuration](#configuration) section)

4. **Start the server**:
   ```bash
   npm start
   ```

## Configuration

### Licenses Configuration

Edit the `licenses.json` file to configure your licenses:

```json
{
  "licenses": {
    "your-license-key": {
      "active": true,
      "expiresAt": "2025-12-31",
      "bots": ["bot-id-1", "bot-id-2"]
    }
  }
}
```

#### License Object Properties:

- `active` (boolean): Whether the license is currently active
- `expiresAt` (string): Expiration date in YYYY-MM-DD format
- `bots` (array): List of authorized bot/application IDs

### Environment Variables

- `PORT`: Server port (default: 55555)

## API Endpoints

### POST `/api/verify`

Verify a license key for a specific bot/application.

**Request Body:**

```json
{
  "key": "your-license-key",
  "botId": "your-bot-id"
}
```

**Success Response (200):**

```json
{
  "valid": true,
  "expiresAt": "2025-12-31"
}
```

**Error Responses:**

- **400 Bad Request** - Invalid request body:

  ```json
  {
    "valid": false,
    "reason": "invalid_request",
    "message": "Both 'key' and 'botId' are required"
  }
  ```

- **404 Not Found** - License key not found:

  ```json
  {
    "valid": false,
    "reason": "not_found",
    "message": "License key not found"
  }
  ```

- **403 Forbidden** - Various authorization issues:
  ```json
  {
    "valid": false,
    "reason": "disabled|expired|unauthorized_bot",
    "message": "Descriptive error message"
  }
  ```

### GET `/health`

Check server health status.

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2025-10-15T12:00:00.000Z"
}
```

## Usage Examples

### cURL

```bash
# Verify a license
curl -X POST http://localhost:55555/api/verify \
  -H "Content-Type: application/json" \
  -d '{"key":"your-license-key","botId":"your-bot-id"}'

# Health check
curl http://localhost:55555/health
```

### JavaScript/Node.js

```javascript
const response = await fetch("http://localhost:55555/api/verify", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    key: "your-license-key",
    botId: "your-bot-id",
  }),
});

const result = await response.json();
console.log(result);
```

### Python

```python
import requests

response = requests.post('http://localhost:55555/api/verify', json={
    'key': 'your-license-key',
    'botId': 'your-bot-id'
})

result = response.json()
print(result)
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Project Structure

```
license-system/
├── server.js          # Main server file
├── licenses.json      # License configuration
├── package.json       # Project dependencies
└── README.md          # This file
```

## Docker Support (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 55555

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t license-system .
docker run -p 55555:55555 license-system
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Considerations

- 🔒 **HTTPS**: Use HTTPS in production environments
- 🛡️ **Rate Limiting**: Consider implementing rate limiting for the API
- 🔐 **Authentication**: Add API authentication for admin endpoints
- 📝 **Logging**: Implement proper logging for security monitoring
- 🚫 **Input Validation**: Validate all input data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/license-system/issues) on GitHub.

## Changelog

### v1.0.0

- Initial release
- Basic license verification
- Health check endpoint
- JSON-based configuration
