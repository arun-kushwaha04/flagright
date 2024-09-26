# Flagright Transaction API

This project implements a backend API for managing concurrent transactions, along with a frontend dashboard for visualizing transaction data. The API is built with Docker Compose for easy deployment of both the frontend and backend services. Additionally, Postman JSON is provided for testing backend APIs that are not available via the frontend interface.

## Project Overview

The project is designed to handle various transaction operations including:
- User authentication using cookies.
- User registration and bank account management.
- Fetching user balances.
- Creating transactions.
- Retrieving transaction details by transaction ID.
- Searching for transactions based on specific filters.
- Generating reports and summaries of transactions.

Additional features include:
- A **CRON job** that generates transactions every second, controllable via the dashboard.
- Pagination and filtering options for transactions.
- **Concurrency handling** using `BullMQ` to process transaction tasks asynchronously with high efficiency.
- **PostgreSQL** database using **Prisma** ORM for data modeling and query execution.
- **Database isolation level serialization** to ensure transaction safety and data consistency.
- Dockerized setup for seamless deployment.

## Key Feature: Concurrency Handling and Transaction Safety

One of the most important aspects of the project is the handling of concurrent transactions with **BullMQ** and **PostgreSQL**.

- **BullMQ**: A job queue that manages concurrent transaction tasks, ensuring that multiple transactions are processed without conflicts or data loss.
- **Serialization Isolation Level**: The project uses the highest isolation level—**Serializable**—in PostgreSQL to ensure that concurrent transactions do not interfere with each other. This isolation level ensures that transactions are executed as if they are running sequentially, eliminating issues such as dirty reads, non-repeatable reads, and phantom reads.

By combining `BullMQ` with the **serialization isolation level**, the system ensures that even under high concurrency, transactions are processed safely and reliably without sacrificing performance.

## Project Structure

- **Frontend**: The frontend is a React-based dashboard that displays transaction data with filtering and sorting options.
- **Backend**: The backend is a Node.js API that handles transaction operations, including concurrency handling via `BullMQ`.
- **Database**: PostgreSQL is used as the database, with Prisma ORM handling database queries and migrations.
- **Docker**: Docker Compose is used to manage both the frontend and backend services.

## Features

1. **User Authentication and Bank Management**
   - User registration and login with cookie-based authentication.
   - Bank creation for users.
   - Fetching user balances.

2. **Transaction API**
   - Create, and retrive for transactions.
   - Filter by user ID, description, date range, amount range, transaction type, transaction state and currency.
   - Sorting by timestamp.
   - Pagination for large datasets.

3. **CRON Job for Automatic Transaction Creation**
   - Generates transactions every second.
   - Controllable via the frontend dashboard (start/stop).

4. **Concurrency Handling**
   - Utilizes BullMQ for asynchronous transaction handling.
   - Ensures safety of concurrent transactions using PostgreSQL’s Serializable isolation level.

5. **Database Seeding**
   - A seeding script is included to populate the PostgreSQL database with dummy transaction data.

6. **Frontend Dashboard**
   - Filter and visualize transaction data.
   - User-friendly interface with options for filtering by amount, date, user ID, and description.

7. **Postman Collection**
   - The Postman JSON is included for testing backend APIs that are not available from the frontend. Import this into Postman to test the API.

## Prerequisites

- Docker
- Docker Compose

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/arun-kushwaha04/flagright.git
cd flagright
```

### 2. Setup evnironment variables
Implement sample `.env.sample` as `.env` and `.env.development.local.sample` as `.env.development.local`

### 3. Start docker compose

```bash
docker-compose up -d --build
```

### 4. Access application
Naviate to `http://localhost:3000` to access frontend, backend is running at `http://localhost:5000`

### 5. Postman collection import
Import postman collection present in `./resources`

## ER diagram
![Database Schema](https://github.com/arun-kushwaha04/flagright/blob/main/resources/Schema%20ER%20diagram.svg)
