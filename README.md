# NestJS REST API – Data Query Service

This is a **NestJS-based REST API** that allows querying financial data using three parameters:

- **Company Ticker** (e.g., `AAPL`)
- **Data Point Name** (e.g., `sector`, `market_cap`)
- **Table Name** (e.g., `companies`, `risk_ratings`, `valuations`)

The application responds with the requested data point fetched directly from a **PostgreSQL** database.

---

## Prerequisites

- Node.js (v22)
- PostgreSQL installed and running locally (if not using Docker)
- Docker & Docker Compose (if running via containers)

---

## Local Development (without Docker)

To run the solution locally (without Docker), enter the following commands:

```bash
npm install
npm run start:seed
```

> The second command (`npm run start:seed`) will:
> - Seed some data into the database (via `seed.ts`)
> - Start the application afterwards

**Note:** When running locally, make sure you have a PostgreSQL server running and configured using the same configuration as described in `.env` file.

---

## Running the App with Docker

To run the app locally with Docker:

```bash
docker-compose -f docker-compose.yml up --build -d
```

---

## Application Access

When running, the solution should be available at:

```
http://localhost:3000/
```

This URL should open this view:

![image](https://github.com/user-attachments/assets/7947f6cd-ebed-4e1c-9ba3-659df830c903)

---

## Test Scenarios

### 1. Example Request

```json
{
  "ticker": "aapl",
  "column": "sector",
  "table": "companies"
}
```

**Expected Result:**

```
"Technology"
```

---

### 2. Example Request

```json
{
  "ticker": "msft",
  "column": "volatility_score",
  "table": "risk_ratings"
}
```

**Expected Result:**

```
0.19
```

---

### 3. Example Request

```json
{
  "ticker": "jpm",
  "column": "market_cap",
  "table": "valuations"
}
```

**Expected Result:**

```
400000000000
```

---

## Tests

There is a test file named `app.controller.spec.ts` that contains a collection of tests covering the full end-to-end process of this flow.

after running command:
npm run test
![image](https://github.com/user-attachments/assets/104931d2-204c-4a26-80ae-0851c6235bdc)

---

## Caching

A simple caching mechanism is implemented.

On each query, the **entire record (row)** from the table is cached.

For example, if a user queries:

```json
{
  "ticker": "aapl",
  "column": "sector",
  "table": "companies"
}
```

Then the entire row for `ticker: "aapl"` in the `companies` table is cached. On subsequent queries for the same table and ticker (e.g., querying `name`, `ticker`, `sector`, or `id`), the result will be served from the cache, and the database will not be called.
