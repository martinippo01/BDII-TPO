select
    c.nro_cliente as "Numero de cliente",
    concat(apellido, ',', nombre) as "Appelido, Nombre",
    nro_factura as "Numero de factura",
    fecha as "Fecha",
    total_sin_iva as "Monto (sin iva)",
    iva as "IVA",
    total_con_iva as "Monto (con iva)"
    from
     e01_factura f
         natural join
    (select nombre, apellido, nro_cliente from e01_cliente where lower(apellido) = lower('Tate') and lower(nombre) = lower('Pandora')) c;