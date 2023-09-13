select distinct(nro_factura) from e01_detalle_factura natural join e01_producto
where marca = 'In Faucibus Inc.'
