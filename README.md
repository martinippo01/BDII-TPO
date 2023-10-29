# SQL part

## Command to create postgres data base with docker
A PostgreSQL database is needed for running the SQL queries and views. 
First, get the latest postgres image from docker.
```bash
docker pull postgres:latest
```
Then, run the following command:
```bash
docker run -d --name TPO_postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -e POSTGRES_DB=VDR -p 5432:5432 postgres
```
## Command to load tables and inserts
In order to insert the data provided by the course chair, run the following commands.
```bash
docker cp ITBA_2023_esquema_facturacion-2.sql TPO_postgres:/load.sql
docker exec -it TPO_postgres psql -U admin -d postgres -a -f /load.sql
```
## Run API
In order to start the API, first run 
```bash 
npm install
```
Then start the API
```bash
node .
```

The API is available at localhost:3000.
Making a get request at / will provide the documentation of the main endpoints of the API.
Furthermore, there are "secret" endpoints that run the queries and create/query the views.

- GET at -> localhost:3000/queries/[number of query]
- POST at -> localhost:3000/view/[number of view] Creates the view
- GET at -> localhost:3000/view/[number of view]  Select * number_view

## Deployed API

The API is deployed and accessible at martinippolito.com.ar:3000. The data is already inserted, and shares the same endpoints.

---
***

# NoSQL part

## Migration
In order to migrate the data given by the course chair, the following steps must be followed.

> Requirment: Linux based OS or WSL, and execute the following commnads from a bash commnad line.

### Create postgreSQL and mongoDB docker containers
From the repository's root
```bash
cd ./compose
docker compose up
```
> Make sure there are no postgreSQL nor mongoDB database already up

Now, the data is inserted in the postgreSQL, but not in the mongoDB

### Migrate to mongoDB
From the repository's root
```bash
cd ./sqlMigrator
chmod u+x ./migrator.sh
./migrator.sh postgres_TP mongo_TP
```

> It is possible to get this error: bad interpreter: No such file or directory.
> In that case just run (install 'dos2unix' if needed) the following:
>  ```bash
>  dos2unix migrator.sh
>  ```

