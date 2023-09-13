select nombre,apellido,sum(total_con_iva)
from e01_cliente natural join e01_factura
group by nombre, apellido
