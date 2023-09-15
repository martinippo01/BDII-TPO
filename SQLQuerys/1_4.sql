-- 4. Seleccionar los productos que han sido facturados al menos 1 vez.


SELECT DISTINCT E01_PRODUCTO.codigo_producto, E01_PRODUCTO.marca, E01_PRODUCTO.nombre
FROM E01_PRODUCTO
JOIN E01_DETALLE_FACTURA ON E01_PRODUCTO.codigo_producto = E01_DETALLE_FACTURA.codigo_producto;
