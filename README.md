# 🚀 Co-Builders - Cofounder Startup Building Platform

A comprehensive platform for finding cofounders, building startups, and launching successful ventures together.

## ✨ Features

- **Entrepreneur Profiles**: Detailed profiles with background, skills, and startup experience
- **Pitch Creation**: Video/audio recording and detailed business concept presentation
- **Pitch Discovery**: Advanced filtering by industry, skills needed, and location
- **Pitch-Back System**: Express interest with specific role proposals and collaboration offers
- **AI Matching**: Cofounder matching algorithm based on complementary skills and vision alignment
- **Startup Roadmap**: Customized milestone generator for each startup idea
- **Project Board**: Interactive execution board with tasks, deadlines, and progress tracking
- **Team Workspace**: Document sharing, meeting scheduler, and decision logging
- **MVP Tracker**: Feature planning and launch countdown with development milestones
- **Equity Framework**: Templates and guidance for role and equity discussions
- **Collaboration Tools**: Real-time wireframing, planning, and execution tools
- **Launch Prep**: Go-to-market planning and investor readiness preparation

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Components**: Custom components with Framer Motion
- **Build Tool**: Vite with production optimizations
- **Deployment**: Docker, Nginx, Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/biggdate.git
cd biggdate

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment

### Quick Deploy
```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Manual Docker
```bash
# Build and start containers
docker-compose up --build -d

# Stop containers
docker-compose down
```

## 🌐 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Static Hosting
Upload the `dist/` folder to any static hosting provider:
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting
- Any CDN

## 📁 Project Structure

```
biggdate/
├── src/
│   ├── components/          # React components
│   │   ├── Messages.jsx     # Chat functionality
│   │   ├── Auth.jsx         # Authentication
│   │   ├── Home.jsx         # Dashboard
│   │   └── ...
│   ├── services/            # Business logic
│   │   ├── aiPsychologyService.js
│   │   ├── gamificationService.js
│   │   └── ...
│   ├── store/               # Redux store
│   ├── utils/               # Utility functions
│   └── App.jsx              # Main application
├── public/                  # Static assets
├── dist/                    # Production build
├── docker-compose.yml       # Docker configuration
├── Dockerfile               # Frontend Docker image
├── nginx.conf               # Nginx configuration
└── deploy.sh                # Deployment script
```

## 🔧 Configuration

### Environment Variables
Copy `production.env` to `.env` and update values:

```bash
cp production.env .env
```

Key variables:
- `VITE_API_URL`: Backend API URL
- `VITE_SOCKET_URL`: WebSocket URL
- `VITE_APP_VERSION`: Application version

### Build Configuration
- **Vite Config**: `vite.config.prod.js` for production
- **Code Splitting**: Automatic chunk splitting
- **Minification**: Terser with console removal
- **Tree Shaking**: Unused code elimination

## 📊 Performance

- **Bundle Size**: 788KB (gzipped: ~200KB)
- **Build Time**: ~8 seconds
- **First Load**: Optimized with code splitting
- **Caching**: 1-year cache for static assets

## 🔒 Security

- **CSP Headers**: Content Security Policy configured
- **XSS Protection**: Cross-site scripting protection
- **HTTPS Ready**: SSL/TLS configuration
- **CORS**: Cross-origin resource sharing configured

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run tests
- `npm run analyze` - Analyze bundle size

## 🚀 Deployment Status

✅ **Production Ready**
- Build successful
- All components working
- Docker configuration ready
- Security headers configured
- Performance optimized

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the deployment guide

---

**Ready to deploy! 🚀**

Built with ❤️ using React, Vite, and modern web technologies.