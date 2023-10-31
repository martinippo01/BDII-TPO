create view E01_FACTURA_ORDENADAS_POR_FECHA as select * from e01_factura order by fecha;
select * from E01_FACTURA_ORDENADAS_POR_FECHA;