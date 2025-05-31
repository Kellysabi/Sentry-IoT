# Sentry IoT

[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

An advanced IoT monitoring and management system built with FastAPI and React, featuring persistent data storage and intelligent device management capabilities.

## 🚀 Features

- **Real-time IoT Device Monitoring**: Track device status, metrics, and health in real-time
- **Advanced Persistence**: Robust data storage with automatic backup and recovery
- **RESTful API**: Comprehensive FastAPI-based backend with automatic documentation
- **Modern Web Interface**: Responsive React frontend for device management
- **Device Analytics**: Advanced analytics and reporting for IoT device performance
- **Alert System**: Configurable alerts and notifications for device events
- **Scalable Architecture**: Designed to handle thousands of IoT devices
- **Security First**: Built-in authentication and authorization mechanisms

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  FastAPI Backend │    │   Database      │
│                 │◄──►│                 │◄──►│   (MongoDB)     │
│   - Dashboard   │    │   - REST API    │    │   - Device Data │
│   - Device Mgmt │    │   - WebSockets  │    │   - Analytics   │
│   - Analytics   │    │   - Auth        │    │   - Logs        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   IoT Devices   │
                       │   - Sensors     │
                       │   - Actuators   │
                       │   - Gateways    │
                       └─────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Motor**: Async MongoDB driver for Python
- **MongoDB**: NoSQL database for flexible device data storage
- **Redis**: Caching and real-time data processing
- **Celery**: Background task processing
- **WebSockets**: Real-time communication

### Frontend
- **React 18**: Modern component-based UI framework
- **TypeScript**: Type-safe JavaScript development
- **Material-UI**: Professional component library
- **React Query**: Efficient data fetching and caching
- **Chart.js**: Data visualization and analytics

### DevOps & Infrastructure
- **Docker**: Containerized deployment
- **Docker Compose**: Multi-service orchestration
- **Nginx**: Reverse proxy and load balancing
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards

## 📋 Prerequisites

Before running this project, ensure you have:

- Python 3.8 or higher
- Node.js 16 or higher
- MongoDB 4.4 or higher
- Redis 6 or higher
- Docker and Docker Compose (for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sentry-iot.git
cd sentry-iot
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize MongoDB collections (optional)
python scripts/init_db.py

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm start
```

### 4. Docker Deployment (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📊 API Documentation

Once the backend is running, visit:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### Key API Endpoints

```http
GET    /api/v1/devices          # List all devices
POST   /api/v1/devices          # Create new device
GET    /api/v1/devices/{id}     # Get device details
PUT    /api/v1/devices/{id}     # Update device
DELETE /api/v1/devices/{id}     # Delete device

GET    /api/v1/analytics        # Device analytics
GET    /api/v1/health           # System health check
POST   /api/v1/auth/login       # User authentication
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/sentry_iot
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# MQTT (for IoT communication)
MQTT_BROKER_HOST=localhost
MQTT_BROKER_PORT=1883
MQTT_USERNAME=your-mqtt-username
MQTT_PASSWORD=your-mqtt-password

# External Services
SENTRY_DSN=your-sentry-dsn-here
```

### Frontend Configuration

Create a `.env.local` file in the frontend directory:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
REACT_APP_ENVIRONMENT=development
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage
```

### Integration Tests

```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📈 Monitoring & Analytics

The system includes comprehensive monitoring capabilities:

- **Device Health Monitoring**: Real-time status tracking
- **Performance Metrics**: Response times, throughput, error rates
- **Custom Dashboards**: Grafana dashboards for system visualization
- **Alerts**: Configurable alerts for device failures and anomalies

Access monitoring at:
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow PEP 8 for Python code
- Use ESLint and Prettier for JavaScript/TypeScript
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/Kellysabi/Sentry-IoT/wiki)
- **Issues**: [GitHub Issues]([https://github.com/Kellysabi/Sentry-IoT/issues)
- **Discussions**: [GitHub Discussions]([https://github.com/Kellysabi/Sentry-IoT/discussions)
- **Email**: kelechiemmanuel888@gmail.com

## 🙏 Acknowledgments

- FastAPI team for the excellent web framework
- React team for the powerful frontend library
- Contributors and the open-source community

## 📊 Project Status

- ✅ Core IoT device management
- ✅ Real-time monitoring
- ✅ Advanced analytics
- 🔄 Machine learning integration (in progress)
- 📋 Mobile application (planned)
- 📋 Edge computing support (planned)

---

**Built with ❤️ by SabiDev**