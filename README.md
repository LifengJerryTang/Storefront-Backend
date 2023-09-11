# Storefront Backend Project

## Getting Started

After cloning the repo, run 
```
npm install
```
to install all the dependencies

## Environment file
My .env file looks like the following, which contains information about my database user, databases, etc.
```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=<your password>
POSTGRES_TEST_DB=storefront_test
ENV=dev
BCRYPT_PASSWORD=<your bcrpyt password>
SALT_ROUNDS=10
ACCESS_TOKEN_SECRET=<your secret token>
```
Some of the information are for you to fill in. **Make sure you make the changes in the database.json file as well!**

## Creating the database user and databases
_Note: this step assumes you have completed the previous steps!_

To create the databases and user, open your terminal and run the following commands (I am using Windows 11)
```
1. psql -U postgres

2. CREATE USER storefront_user WITH PASSWORD '<your password>';

3. CREATE DATABASE storefront;

4. CREATE DATABASE storefront_test;

5. \c storefront

6. GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront_user;

7. GRANT ALL ON SCHEMA public TO storefront_user;

8. \c storefront_test

9. GRANT ALL PRIVILEGES ON DATABASE storefront_Test TO storefront_user;

10. GRANT ALL ON SCHEMA public TO storefront_user;
```

## Database Migration
The database migration files have already been created. To run the migrations, simply run
```
db-migrate up
```

## Backend Ports and Database Ports
- Both the regular database and the test database are running on port 5432
- The backend express server runs on port 3000. In a test environment, the server runs on port 3001.

## Running the Tests
To run the tests, in your .env file, change ENV to test and run
```
npm run tests
```


