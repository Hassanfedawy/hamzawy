# Hamzawy Fitness Platform

A comprehensive fitness drill and workout management web application built with Next.js, React, TypeScript, and MongoDB.

## Features

- 🏋️‍♂️ Dynamic workout generation
- 💪 Multiple workout styles (Circuit, HIIT, Strength, etc.)
- 📝 Comprehensive drill management
- 🎯 Customizable workout parameters
- 📊 Workout history tracking
- 🔄 Template-based workouts

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Icons**: Heroicons

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- MongoDB Atlas account
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hamzawy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Run the development server:
```bash
npm run dev
```

## Deployment

### Preparing for Production

1. Update environment variables:
   - Create a `.env.production` file
   - Set secure MongoDB credentials
   - Update API URL to your production domain

2. Build the application:
```bash
npm run build
```

3. Test the production build locally:
```bash
npm run start
```

### Deploying to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Alternative Deployment Options

1. **Docker**:
   - Build the Docker image
   - Deploy to your preferred container service

2. **Traditional Hosting**:
   - Build the application
   - Set up a Node.js server
   - Configure reverse proxy (nginx/Apache)

## Security Checklist

Before deploying:
- [ ] Secure MongoDB credentials
- [ ] Enable rate limiting
- [ ] Implement proper error handling
- [ ] Add input validation
- [ ] Set up proper CORS policies
- [ ] Configure security headers

## Performance Optimization

- [ ] Implement caching strategies
- [ ] Optimize images and assets
- [ ] Add loading states
- [ ] Configure proper meta tags
- [ ] Enable compression

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
