COPY (SELECT row_to_json(results)
  FROM e01_cliente
results) TO '/tmp/cliente.json' WITH (FORMAT text, HEADER FALSE)