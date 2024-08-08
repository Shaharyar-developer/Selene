# Selene

Welcome to the Selene project! Follow the instructions below to set up and run the project on your local development environment.

## Getting Started

To get started with developing the Selene project, follow these steps:

### 1. Clone the Repository

First, clone the repository to your local machine:
```bash
    git clone https://github.com/Shaharyar-developer/Selene.git
    cd Selene
```
### 2. Prerequisites

Ensure that you have the following installed on your machine:

- **Bun**: [Installation Instructions](https://bun.sh/)
- **Docker**: [Installation Instructions](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Installation Instructions](https://docs.docker.com/compose/install/)

### 3. Install Dependencies

Install project dependencies using Bun:
```bash
    bun install
```
### 4. Set Up Docker

Run Docker Compose to build and start the Docker containers:
```bash
    docker compose up
```
### 5. Build Android Client

To build the Android client APK, run:
```bash
    bun run build:android
```
### 6. Start the Server

Start the server using Docker Compose:
```bash
    docker compose up
```
### 7. Start the Expo Server

Finally, start the Expo server:
```bash
    bun run start
```

Happy coding!
