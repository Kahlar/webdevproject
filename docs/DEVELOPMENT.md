# Development Guide

## Prerequisites

- Node.js 18.x or later
- MongoDB 6.x or later
- Git
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/greensphere.git
cd greensphere
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration values.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
greensphere/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── docs/                  # Documentation
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── messages/             # Internationalization messages
```

## Development Workflow

### Code Style

- Follow the TypeScript style guide
- Use ESLint for code linting
- Format code using Prettier
- Write meaningful commit messages

### Git Workflow

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "feat: add your feature"
```

3. Push your changes:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

### Testing

1. Write unit tests for new features
2. Test API endpoints using Postman or similar tools
3. Run the test suite:
```bash
npm test
# or
yarn test
```

## API Development

### Creating New Endpoints

1. Create a new route file in `app/api/`
2. Export HTTP method handlers (GET, POST, etc.)
3. Use the service layer for business logic
4. Handle errors appropriately
5. Add input validation using Zod

Example:
```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ExampleService } from '@/app/services/example';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    
    const result = await ExampleService.create(validatedData);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Database Development

### Adding New Collections

1. Define the interface in `types/`
2. Create a service in `app/services/`
3. Add indexes for performance
4. Update the database schema documentation

Example:
```typescript
// types/example.ts
export interface Example {
  _id?: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// app/services/example.ts
import { getCollection } from './mongodb';
import { Example } from '@/types/example';

export class ExampleService {
  static async create(data: Omit<Example, '_id'>) {
    const collection = await getCollection('examples');
    const result = await collection.insertOne(data);
    return { ...data, _id: result.insertedId.toString() };
  }
}
```

## Frontend Development

### Adding New Components

1. Create the component in `app/components/`
2. Use TypeScript for type safety
3. Follow the component design system
4. Add proper error handling
5. Include loading states

Example:
```typescript
// app/components/Example.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ExampleProps {
  title: string;
  description: string;
}

export function Example({ title, description }: ExampleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Handle action
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Click me'}
      </Button>
    </div>
  );
}
```

## Deployment

### Production Build

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm start
# or
yarn start
```

### Environment Variables

Required environment variables for production:
- `MONGODB_URI`
- `MONGODB_DB`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Troubleshooting

### Common Issues

1. MongoDB Connection Issues
   - Check if MongoDB is running
   - Verify connection string in `.env.local`
   - Check network connectivity

2. Build Errors
   - Clear `.next` directory
   - Remove `node_modules`
   - Reinstall dependencies

3. TypeScript Errors
   - Run `npm run type-check`
   - Update type definitions
   - Fix type mismatches

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) 