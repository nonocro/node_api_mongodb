# NOA BREVET - Potion API

Potion API is a Node.js and MongoDB-based RESTful API for managing potions, user authentication, and analytics. It includes features like user registration, login, and advanced analytics for potion data.

## Features

- **Authentication**: User registration, login, and logout with JWT-based authentication.
- **Potion Management**: CRUD operations for potions.
- **Analytics**: Advanced analytics, including grouping, averages, and ratios.
- **Swagger Documentation**: API documentation available at `/api-docs`.

---

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nonocro/node_api_mongodb.git
   cd node_api_mongodb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
MONGO_URI=mongodb://localhost:27017/potiondb
PORT=3000
JWT_SECRET=your_jwt_secret
COOKIE_NAME=you_cookie_name
```

---

## Usage

### Start the Server

- Development mode:
  ```bash
  npm run dev
  ```

- Production mode:
  ```bash
  npm start
  ```

### Access Swagger Documentation

Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to view the API documentation.

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| POST   | `/auth/register` | Register a new user       |
| POST   | `/auth/login`    | Log in a user             |
| GET    | `/auth/logout`   | Log out a user            |

### Potions

| Method | Endpoint               | Description                        |
|--------|------------------------|------------------------------------|
| GET    | `/potions`             | Get all potions                   |
| GET    | `/potions/names`       | Get names of all potions          |
| GET    | `/potions/vendor/:id`  | Get potions by vendor ID          |
| GET    | `/potions/price-range` | Get potions within a price range  |
| GET    | `/potions/:id`         | Get a potion by ID                |
| POST   | `/potions`             | Create a new potion               |
| PUT    | `/potions/:id`         | Update a potion by ID             |
| DELETE | `/potions/:id`         | Delete a potion by ID             |

### Analytics

| Method | Endpoint                          | Description                                   |
|--------|-----------------------------------|-----------------------------------------------|
| GET    | `/analytics/distinct-categories` | Get the total number of distinct categories  |
| GET    | `/analytics/average-score-by-vendor` | Get average score grouped by vendor        |
| GET    | `/analytics/average-score-by-category` | Get average score grouped by category     |
| GET    | `/analytics/strength-flavor-ratio` | Get strength-to-flavor ratio for potions   |
| GET    | `/analytics/search`              | Search potions by name and price range       |
| GET    | `/analytics/group`               | Group potions by a field and calculate metric|

---

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing potion data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: Authentication using JSON Web Tokens.
- **Swagger**: API documentation.
- **dotenv**: Environment variable management.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

Developed by **Brevet Noa**.
