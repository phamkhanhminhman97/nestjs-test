# NestJS Test Project

## Description
This is a NestJS test project that demonstrates a basic setup with PostgreSQL database integration using Docker.

## Prerequisites
- Node.js (v20.16 or later)
- Yarn package manager
- Docker and Docker Compose

## Installation
1. Install Yarn if you haven't already:
   ```bash
   npm install -g yarn
   ```

2. Install project dependencies:
   ```bash
   yarn install
   ```

## Environment Setup
1. Contact the project maintainer to obtain the required `.env` file containing environment variables

2. Place the `.env` file in the root directory of the project

## Running the Application

1. Start the PostgreSQL database using Docker:
   ```bash
   docker compose up -d
   ```
   This will start a PostgreSQL 16 container with the configurations specified in your `.env` file.

2. Run database migrations to set up the schema:
   ```bash
   yarn migrate:up
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

## Development Notes
- For testing purposes, you may need to uncomment the `onModuleInit` method in the `AssetService` class
- After making changes to the `AssetService`, restart the server for changes to take effect

## Docker Configuration
The project includes:
- PostgreSQL 16 database
- Node.js 20.16 runtime environment