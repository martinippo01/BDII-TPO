#!/bin/bash
docker cp ./productos.sql $1:/tmp/productos.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/productos.sql
docker cp $1:/tmp/productos.json productos.json
docker cp ./productos.json $2:/tmp/productos.json
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/tp2 --authenticationDatabase admin --eval "db.producto.drop()"
docker exec $2 mongoimport -d tp2 --authenticationDatabase admin --username admin --password admin -c producto --file  /tmp/productos.json 

docker cp ./clientes.sql $1:/tmp/clientes.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/clientes.sql
docker cp $1:/tmp/clientes.json clientes.json
docker cp ./clientes.json $2:/tmp/clientes.json
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/tp2 --authenticationDatabase admin --eval "db.cliente.drop()"
docker exec $2 mongoimport -d tp2 --authenticationDatabase admin --username admin --password admin -c cliente --file  /tmp/clientes.json 

docker cp ./factura.sql $1:/tmp/factura.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/factura.sql
docker cp $1:/tmp/factura.json factura.json
docker cp ./factura.json $2:/tmp/factura.json
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/tp2 --authenticationDatabase admin --eval "db.factura.drop()"
docker exec $2 mongoimport -d tp2 --authenticationDatabase admin --username admin --password admin -c factura --file  /tmp/factura.json 

docker cp ./telefono.sql $1:/tmp/telefono.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/telefono.sql
docker cp $1:/tmp/telefono.json telefono.json
docker cp ./telefono.json $2:/tmp/telefono.json
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/tp2 --authenticationDatabase admin --eval "db.telefono.drop()"
docker exec $2 mongoimport -d tp2 --authenticationDatabase admin --username admin --password admin -c telefono --file  /tmp/telefono.json 

rm -r *.json