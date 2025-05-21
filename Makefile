.PHONY: install dev build deploy clean

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Deploy to GitHub Pages
deploy: build
	@echo "Deploying to GitHub Pages..."
	npx gh-pages -d dist

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf node_modules

# Help command
help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Run development server"
	@echo "  make build    - Build for production"
	@echo "  make deploy   - Deploy to GitHub Pages"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make help     - Show this help message"

# Default target
.DEFAULT_GOAL := help