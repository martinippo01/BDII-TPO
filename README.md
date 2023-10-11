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

- localhost:3000/queries/<number of query> [GET method]
- localhost:3000/view/<number of view> [POST method] -> Create the view
- localhost:3000/view/<number of view> [GET method] -> Select * view


# NO-SQL Part
user: admin
password: admin


./scr <id-container-sql> <id-container-mongo>

- postgres