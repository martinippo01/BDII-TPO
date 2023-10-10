COPY (SELECT row_to_json(results)
FROM (
  SELECT nro_factura as id,fecha,total_sin_iva,total_con_iva,iva,nro_cliente,
    (
      SELECT array_to_json(array_agg(o))
      FROM (
        SELECT nro_item,cantidad,codigo_producto
        FROM e01_detalle_factura
        WHERE e01_factura.nro_factura = e01_detalle_factura.nro_factura
      ) o
    ) AS detalle_factura
  FROM e01_factura
) results) TO '/tmp/factura.json' WITH (FORMAT text, HEADER FALSE)