# Fulcrum-Gateway
The backend API (Fulcrum) and frontend UI (Gateway) for FieFoe.

# <!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#setup">Setup</a>
      <ul>
        <li><a href="#frameworks">Frameworks</a></li>
      </ul>
    </li>
    <li>
      <a href="#git-structure">Git Structure</a>
    </li>
    <li><a href="#directory-structure">Directory Structure</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>

# Setup
This project is written in JavaScript/TypeScript.
Here's a rough table of the frameworks used in this project roughly in order of highest to lowest level,
along with some resources I followed (thank you to the creators of said resources!).

## Frameworks
| Framework | Description | Resources |
| --- | ----------- | ---------- |
| React Native | Foundation for the frontend stack. We use only functional components and hooks. | https://reactnative.dev/docs/environment-setup |
| NativeBase | UI and component library built on React Native. | https://docs.nativebase.io/install-expo |
| React Native for Web | Supported by all frontend frameworks we're using for optimizing mobile web view. |  |
| React Navigation | The frontend routing and navigation framework (basically React Router for mobile). | https://reactnavigation.org/docs/getting-started/ |
| i18next | Used for multi-language support. | https://brainsandbeards.com/blog/i18n-in-react-native-apps |
| Expo | Used for easier cross-platform development. | https://docs.expo.dev/get-started/installation/ |
| ExpressJS | Used to write our backend API. | https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way |
| NodeJS | To support Express for our backend. |  |
| GraphQL | Used with express JS for cleaner access to API | https://blog.bitsrc.io/migrating-existing-rest-apis-to-graphql-2c5de3db647d |
| Prisma | Our choice of ORM and database connector working in conjunction with GraphQL | N/A |
| Postgres | As a persistent database that will communicate primarily with redis for updates | N/A |
| Jest | Our choice of testing framework for both frontend and backend | N/A |
| Winston | Our choice of logging framework | N/A |

## Structure
The frontend aesthetic is built to mimic Kahoot, and the directory structure follows atomic design principles.
The backend design is built with the axiom; all queuers belong to a queue, and all queues belong to an organizer.

## Installation
Once you've git cloned the repo:
`git clone repo-name`

you can navigate to the root direcotry:
`cd root-dir-name`

and run npm install:
`npm install`

## Usage
Once dependencies are installed, you can install then run with either expo:
`npm install --global expo-cli`
`expo start`

or with react native:
`npx react-native start`
`npx react-native run-android` or run-ios

To start the backend, navigate to the index.ts file:
`cd src/api/routes`

Install ts-node:
`npm install ts-node -g`

and run node (Before you actually run though you'll want to set up the database in the following section):
`ts-node index.ts`

or if you want to use nodemon:
`nodemon index.ts`

To run Jest tests:
`npm test`

Next set up a .env file with the following variables:
```
FRONTEND_PROD_URL="production url of the frontend app"
FRONTEND_LOCAL_URL="development url of the frontend app"
DATABASE_URL="postgresql database url"
SESSION_SECRET="express session secret"
NODE_ENV="development or production"
SMTP_USERNAME="username for smtp service you're using"
SMTP_PASSWORD="password for smtp service you're using"
SMTP_SERVER="smtp server host"
SENDER_EMAIL="the sender email (ex: hello@fiefoe.com)"
TWILIO_ACCOUNT_SID="twilio account sid"
TWILIO_AUTH_TOKEN="twilio auth token"
TWILIO_PHONE_NUMBER="phone number used to send out SMS"
```

## Database setup
You can install postgres any way you want. Using brew or their GUI interface will work.
But you can also use Docker:

After you've installed Docker, run:
`docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=some_password --name some_container_name postgres`

This will also forward/expose the port from the Docker VM to your host machine.
Accessing the docker VM can be done through Docker Desktop and clicking the container's CLI icon or running:
`docker exec -it some_container_name`

Inside the container's command line run:
`su postgres`
to switch to the postgres user. Then you can run:
`psql`
or alternatively you can combine the above two commands by just running:
`psql -U postgres` if you want to directly go into psql mode.

You'll have to go into the VM and create a new database with either:
`createdb -U username postgres`
if you're working in bash

`CREATE DATABASE some_db_name TEMPLATE template0`
if you're inside psql

You'll need a .env file in the root dir of your project with the following inside:
`DATABASE_URL="postgresql://db_username:db_password@exposed_ip:exposed_host_port/name_of_db`

The ip and port should just be localhost:5432 and the db username by default should be "postgres".

We also use Redis as our caching and authentication solution:
`brew install redis@3.1.2`

Then you can start Redis
`redis-server`

## Prisma setup

Finally, run:
`npx prisma db push`
and Prisma should push the prisma schemas to the PostgreSQL database and create
the necessary tables.

To populate the database with initial test data:
`npx prisma db seed` which will run fulcrum_gateway/prisma/seed.ts

To simply re-generate the prisma client and typegraphql integration run:
`npx prisma generate`.
This is useful if you want to re-generate the client during development but don't want to push
changes to the PostgreSQL database structure yet (which will be done with prisma db push).

## Git structure
I use 4 branches to work:
1. `main` is a working version of the project ready for demos.
2. `feature` is the frontend development branch.
3. `backend` is the backend development branch.
4. `hotfix` is for urgent bug fixes and other immediate issues.
5. `intl` is for internationalization/localization of the project.

## Backend Directory Structure
### src/
All source code lives in this directory
### ./api/
All code associated with the API.
All backend code lives here, and may one day be sequestered into its own repository to prevent bloat.
### ./routes/
All routes are defined in these files, index.js imports all the route files and initializes the backend API.
### ./controllers/
Routes are supplied data by controllers which are in charge of calling the appropriate services to build a response.
### ./services/
Services are called by controllers. Services can call other services and interact directly with the cache and database.
### ./db/
Database layer is for all code that pertains to making queries to the database. Cache is kept separately.

## Frontend Directory structure
### src/
All source code lives in this directory
### ./assets/
All asset files not provided by CDNs lives here.
### ./components/
All code associated with components lives here.
A component is defined as something that should not be used independently (i.e it must be combined with other components)
Components are categorized in accordance with atomic design principles.
### ./containers/
All screen-based AND page-based items can be placed inside containers, which act as wrappers that provide additional functionality.
Screen overlays, headers, modals, menus, alerts, pop-ups, etc. are also stored here.
### ./pages/
Pages are combinations of components that hold state.
### ./screens/
Screens are standalone static sites that may also use components, but hold no state.

# Roadmap
Coming soon!
