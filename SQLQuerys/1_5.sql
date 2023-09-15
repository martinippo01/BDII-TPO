select
    nro_cliente as "Numero de cliente",
    concat(apellido, ',', nombre) as "Appelido, Nombre",
    tipo as "Sexo",
    direccion as "Direccion",
    activo as "Activo",
    concat('(',codigo_area,') ', nro_telefono) as "Numero de telefono"
from e01_cliente natural join e01_telefono;