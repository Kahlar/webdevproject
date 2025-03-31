# GreenSphere

A modern web application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- MongoDB as the database
- Shadcn UI components
- Chart.js for data visualization
- Next-intl for internationalization
- Framer Motion for animations
- Zod for schema validation

## 📋 Prerequisites

- Node.js 18.x or later
- MongoDB instance
- npm or yarn package manager

## 🛠️ Installation

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

## 🚀 Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📚 Documentation

- [API Documentation](docs/API.md) - Detailed API endpoints and usage
- [Database Schema](docs/DATABASE.md) - MongoDB collections and relationships
- [Development Guide](docs/DEVELOPMENT.md) - Setup and development workflow

## 🏗️ Build

Build the application for production:
```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm start
# or
yarn start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
greensphere/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions
├── public/          # Static assets
├── types/           # TypeScript type definitions
└── messages/        # Internationalization messages
```

## 🔧 Configuration

- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
