# Full Stack Authentication System

A complete authentication system with Django REST Framework backend and Next.js frontend.

## Backend (Django)

### Setup
1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `.env`

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Start server:
```bash
python manage.py runserver
```

## Frontend (Next.js)

### Setup
1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Run development server:
```bash
npm run dev
```

### Features
- TypeScript support
- Tailwind CSS for styling
- JWT authentication
- Protected routes
- Form validation
- Responsive design
- Profile management

### Project Structure
```
frontend/
├── src/
    ├── components/     # Reusable components
    ├── context/        # Auth context
    ├── lib/           # Utilities and API
    └── app/           # Pages and layouts
```

## API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/refresh - Token refresh
- POST /api/auth/logout - User logout
- GET /api/auth/profile - Get user profile

## Development

### Backend Extensions
To add new features:
1. Create new models in `backend/auth/models.py`
2. Add serializers in `backend/auth/serializers.py`
3. Create views in `backend/auth/views.py`
4. Update URLs in `backend/auth/urls.py`

### Frontend Extensions
To add new features:
1. Create components in `src/components`
2. Add new pages in `src/app`
3. Update types in `src/lib/types`
4. Add API endpoints in `src/lib/api`

## AI Development Guide

When working with this codebase, use the following prompt structure:

```
I'm working with the auth system that has:

Frontend (Next.js 14+):
1. Structure:
   - TypeScript + Tailwind CSS
   - AuthProvider context
   - Form components with validation
   - API client with auth handling

2. Features:
   - JWT token management
   - Form validation
   - Protected routes
   - Profile management
   - Responsive UI

Backend (Django):
1. Structure:
   - Django REST Framework
   - JWT authentication
   - Custom user profile
   - Protected endpoints

[Your specific question or requirement here]
```

## Security Features
- JWT token authentication
- Protected routes
- Form validation
- Secure password handling
- CORS configuration
- TypeScript type safety

