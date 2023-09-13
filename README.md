## Command to create postgres with docker

```
docker run -d --name bd2 -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -e POSTGRES_DB=VDR -p 5432:5432 postgres
```

## Command to load tables and inserts

```
docker cp ITBA_2023_esquema_facturacion-2.sql bd2:/load.sql
docker exec -it bd2 psql -U admin -d postgres -a -f /load.sql
```
