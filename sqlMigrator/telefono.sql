COPY (SELECT row_to_json(e01_telefono)
      FROM e01_telefono
    ) TO '/tmp/telefono.json' WITH (FORMAT text, HEADER FALSE)
