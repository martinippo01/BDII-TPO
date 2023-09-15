-- 2. Seleccionar todos los clientes que tengan registrada al menos una factura.


SELECT DISTINCT E01_CLIENTE.nro_cliente, E01_CLIENTE.nombre, E01_CLIENTE.apellido
FROM E01_CLIENTE
JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente;
