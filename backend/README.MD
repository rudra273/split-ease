# Authentication System
A complete authentication system with Django REST Framework backend and Next.js frontend.

## Backend Setup (Django)

### Project Structure
```
backend/
├── .env
├── requirements.txt
├── manage.py
├── backend/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── auth/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── serializers.py
    ├── urls.py
    └── views.py
```

### Environment Variables (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Installation & Setup
1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
```

5. Run the server:
```bash
python manage.py runserver
```

### API Endpoints
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/refresh - Token refresh
- POST /api/auth/logout - User logout
- GET /api/auth/profile - Get user profile

### AI Prompt Guide
When working with this codebase, you can use the following prompt structure:

```
I'm working with the authentication system that has the following implementations:

Backend (Django):
1. Project Structure:
   - Main app: 'backend'
   - Auth app: 'auth'
   - Using Django REST Framework
   - JWT authentication (djangorestframework-simplejwt)
   - CORS configured for Next.js frontend

2. Models:
   - Using Django's built-in User model
   - Custom Profile model with OneToOneField relationship
   - Profile fields: phone, created_at, updated_at

3. Authentication:
   - JWT token based authentication
   - Token refresh mechanism
   - Protected routes using permissions.IsAuthenticated
   - Token blacklisting on logout

4. API Endpoints:
   - /api/auth/register (POST)
   - /api/auth/login (POST)
   - /api/auth/refresh (POST)
   - /api/auth/logout (POST)
   - /api/auth/profile (GET/PUT)

5. Serializers:
   - UserSerializer
   - ProfileSerializer
   - RegisterSerializer (with nested profile creation)
   - LoginSerializer

6. Environment Configuration:
   - Using python-dotenv
   - Configurable DEBUG, SECRET_KEY, ALLOWED_HOSTS
   - CORS settings for frontend

[Your specific question or requirement here]
```

This helps AI understand:
1. The exact project structure
2. The authentication flow
3. Model relationships
4. Serializer setup
5. API endpoint structure
6. Configuration details

When requesting frontend implementation, specify:
1. Next.js version (14+)
2. TypeScript requirements
3. Tailwind CSS configuration
4. ESLint rules
5. Folder structure preferences
6. API client requirements

### Token Information
- Access Token Lifetime: 60 minutes
- Refresh Token Lifetime: 1 day
- Token Refresh: Enabled
- Token Blacklisting: Enabled

### Security Features
- Password validation using Django's default validators
- CORS configuration with specific origin allowance
- Protected routes using DRF permissions
- Secure token handling
- Request validation using serializers

### API Response Formats

#### Registration Response:
```json
{
    "refresh": "jwt-refresh-token",
    "access": "jwt-access-token"
}
```

#### Login Response:
```json
{
    "refresh": "jwt-refresh-token",
    "access": "jwt-access-token"
}
```

#### Profile Response:
```json
{
    "id": 1,
    "user": {
        "id": 1,
        "username": "username",
        "email": "email@example.com",
        "first_name": "First",
        "last_name": "Last"
    },
    "phone": "1234567890",
    "created_at": "2024-01-21T00:00:00Z",
    "updated_at": "2024-01-21T00:00:00Z"
}
```

