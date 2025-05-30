.PHONY: install dev build deploy clean

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build for production
build: clean
	npm run build

# Build for deployment
deploy: build
	@echo "Project built in dist/ directory"

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