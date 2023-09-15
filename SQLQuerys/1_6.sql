select
    c.nro_cliente as "Numero de cliente",
    concat(apellido, ',', nombre) as "Appelido, Nombre",
    cant_fact as "Cantidad de facturas"
from e01_cliente as c join (select nro_cliente, count(*) as cant_fact from e01_factura group by nro_cliente) as f on f.nro_cliente = c.nro_cliente;