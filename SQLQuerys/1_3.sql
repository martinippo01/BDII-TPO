-- 3. Seleccionar todos los clientes que no tengan registrada una factura.


SELECT E01_CLIENTE.nro_cliente, E01_CLIENTE.nombre, E01_CLIENTE.apellido
FROM E01_CLIENTE
LEFT JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente
WHERE E01_FACTURA.nro_factura IS NULL;
