-- Insertar un producto nuevo (Estamos seguro que no se haya facturado)
INSERT INTO e01_producto
    (codigo_producto, marca, nombre, descripcion, precio, stock)
        VALUES
    (101, 'Creav inc.', 'Marcador','Marcador azul', 45.3, 100);

create view PRODUCTOS_NO_FACTURADOS as select * from e01_producto
         where codigo_producto not in(
             select p.codigo_producto from e01_producto p join e01_detalle_factura df on p.codigo_producto = df.codigo_producto
             );
select * from PRODUCTOS_NO_FACTURADOS;