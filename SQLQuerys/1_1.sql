--1. Obtener el teléfono y el número de cliente del cliente con nombre "Wanda" y apellido "Baker".

SELECT nro_cliente, codigo_area, nro_telefono
FROM E01_CLIENTE
JOIN E01_TELEFONO ON E01_CLIENTE.nro_cliente = E01_TELEFONO.nro_cliente
WHERE E01_CLIENTE.nombre = 'Wanda' AND E01_CLIENTE.apellido = 'Baker';
