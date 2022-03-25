
## Owl Project (Tornado/React)

#### `git clone https://github.com/j-masci/owl-project .`

### Directories:

- /server contains server code.
- /src contains client code.
- /public, client web server uses this

### Client

Install:

#### `yarn install --ignore-engines`

Ignore engines is usually optional (but I needed to use it). Something to do with eslint.

Run:

#### `yarn start`

This will serve the client side app at http://localhost:3000 

It will also watch the code for changes.

### Server/API

Obviously, use a virtual env if you want:

#### `python -m virtualenv venv`
#### `venv\Scripts\activate`

Install:

#### `pip install -r requirements.txt`

Then, seed the database (drop and create all tables and add some initial data):

Seeding needs to be done only once during installation, but can be done afterwards as needed to reset all data.

#### `python server/app.py --seed`

Then, start the server:

#### `python server/app.py --start`

You should see the message, "API Started", at http://localhost:3003.

