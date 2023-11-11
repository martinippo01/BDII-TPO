docker exec $1 psql -U admin -d postgres -c "CREATE DATABASE TPO;"
docker cp ../schema.sql $1:/tmp/schema.sql
docker cp ../inserts.sql $1:/tmp/inserts.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/schema.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/inserts.sql


docker cp ./productos.sql $1:/tmp/productos.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/productos.sql
docker exec -it $1 mv /tmp/productos.json /tmp/migration/productos.json
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/TPO --authenticationDatabase admin --eval "db.producto.drop()"
docker exec $2 mongoimport -d TPO --authenticationDatabase admin --username admin --password admin -c producto --file  /migration/productos.json 
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/TPO --authenticationDatabase admin --eval "db.producto.createIndex( { 'nro_producto':1 }, { unique:true})"


docker cp ./clientes.sql $1:/tmp/clientes.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/clientes.sql
docker exec -it $1 mv /tmp/cliente.json /tmp/migration/cliente.json
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/TPO --authenticationDatabase admin --eval "db.cliente.drop()"
docker exec $2 mongoimport -d TPO --authenticationDatabase admin --username admin --password admin -c cliente --file  /migration/cliente.json
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/TPO --authenticationDatabase admin --eval "db.cliente.createIndex( { 'nro_cliente':1 }, { unique:true})"


docker cp ./factura.sql $1:/tmp/factura.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/factura.sql
docker exec -it $1 mv /tmp/factura.json /tmp/migration/factura.json
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/TPO --authenticationDatabase admin --eval "db.factura.drop()"
docker exec $2 mongoimport -d TPO --authenticationDatabase admin --username admin --password admin -c factura --file  /migration/factura.json 
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/TPO --authenticationDatabase admin --eval "db.factura.createIndex( { _id:1, 'detalles_factura.nro_item':1 }, { unique:true})"

docker cp ./telefono.sql $1:/tmp/telefono.sql
docker exec -u postgres $1 psql -U admin -d postgres --file /tmp/telefono.sql
docker exec -it $1 mv /tmp/telefono.json /tmp/migration/telefono.json
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/TPO --authenticationDatabase admin --eval "db.telefono.drop()"
docker exec $2 mongoimport -d TPO --authenticationDatabase admin --username admin --password admin -c telefono --file  /migration/telefono.json 
docker exec $2 mongosh mongodb://admin:admin@127.0.0.1:27017/TPO --authenticationDatabase admin --eval "db.telefono.createIndex( { 'codigo_area':1, 'nro_telefono':1}, { unique:true})"
