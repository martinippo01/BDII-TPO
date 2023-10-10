COPY (SELECT row_to_json(results)
      FROM (select e01_producto.codigo_producto as codigo,
                   e01_producto.nombre as nombre,
                   e01_producto.descripcion as descripcion,
                   e01_producto.marca as marca,
                   e01_producto.precio as precio,
                   e01_producto.stock as stock
            from e01_producto )
    results) TO '/tmp/productos.json' WITH (FORMAT text, HEADER FALSE,ENCODING 'UTF8')