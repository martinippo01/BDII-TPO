###1. Obtener el teléfono y el número de cliente del cliente con nombre "Wanda" y apellido "Baker".

```
SELECT nro_cliente, codigo_area, nro_telefono
FROM E01_CLIENTE
JOIN E01_TELEFONO ON E01_CLIENTE.nro_cliente = E01_TELEFONO.nro_cliente
WHERE E01_CLIENTE.nombre = 'Wanda' AND E01_CLIENTE.apellido = 'Baker';
```

###2. Seleccionar todos los clientes que tengan registrada al menos una factura.

```
SELECT DISTINCT E01_CLIENTE.nro_cliente, E01_CLIENTE.nombre, E01_CLIENTE.apellido
FROM E01_CLIENTE
JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente;
```

###3. Seleccionar todos los clientes que no tengan registrada una factura.

```
SELECT E01_CLIENTE.nro_cliente, E01_CLIENTE.nombre, E01_CLIENTE.apellido
FROM E01_CLIENTE
LEFT JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente
WHERE E01_FACTURA.nro_factura IS NULL;
```

###4. Seleccionar los productos que han sido facturados al menos 1 vez.

```
SELECT DISTINCT E01_PRODUCTO.codigo_producto, E01_PRODUCTO.marca, E01_PRODUCTO.nombre
FROM E01_PRODUCTO
JOIN E01_DETALLE_FACTURA ON E01_PRODUCTO.codigo_producto = E01_DETALLE_FACTURA.codigo_producto;
```
