# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive Developer Handbook (CONTRIBUTING.md).
- Security Policy and Incident Response Plan (SECURITY.md).
- Code of Conduct (CODE_OF_CONDUCT.md).
- Redis support for caching and session management.
- GitHub Actions workflow for CI/CD.
- Railway deployment configuration (`railway.json`).
- Production Docker Compose configuration (`docker-compose.prod.yml`).
- Production Nginx configuration with security headers.
- Adminer service for database management.
- Docker support for Backend (PHP 8.2) and Frontend (Node 22).

### Changed
- Updated `README.md` with Docker installation instructions.
- Optimized Docker builds with `.dockerignore`.
- Updated PHP configuration for production performance (Opcache).

### Fixed
- Fixed backend 500 error by adding `.env` and fixing permissions.
- Fixed frontend connection refused error by updating Node.js version.
- Fixed database connection strings for Docker environment.

## [1.0.0] - 2025-12-01
### Added
- Initial release of Donasiku.
- User authentication (Login, Register).
- Donation management (CRUD).
- Request management.
- Chat system.

[Unreleased]: https://github.com/Mazkad12/DONASIKU-WEBPRO/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Mazkad12/DONASIKU-WEBPRO/releases/tag/v1.0.0
