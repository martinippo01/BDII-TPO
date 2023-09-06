## Command to create postgres with docker

```
docker run -d --name bd2 -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -e POSTGRES_DB=VDR -p 5432:5432 postgres
```
