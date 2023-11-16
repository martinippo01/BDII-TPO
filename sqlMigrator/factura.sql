COPY (
  SELECT row_to_json(results)
  FROM (
    SELECT
      nro_factura as id,
      fecha,
      -- Calculate total_sin_iva based on the sum of detalle_factura amounts
      (SELECT COALESCE(SUM(cantidad * p.precio), 0) FROM e01_detalle_factura d JOIN e01_producto p ON d.codigo_producto = p.codigo_producto WHERE d.nro_factura = e01_factura.nro_factura) AS total_sin_iva,
      -- Calculate total_con_iva based on total_sin_iva
      (SELECT COALESCE(total_sin_iva + total_sin_iva * 0.21, 0)) AS total_con_iva,
      iva,
      nro_cliente,
      (
        SELECT array_to_json(array_agg(o))
        FROM (
          SELECT nro_item, cantidad, codigo_producto
          FROM e01_detalle_factura
          WHERE e01_factura.nro_factura = e01_detalle_factura.nro_factura
        ) o
      ) AS detalle_factura
    FROM e01_factura
  ) results
) TO '/tmp/factura.json' WITH (FORMAT text, HEADER FALSE);
