db.factura.find({"detalle_factura.codigo_producto":{$in:db.producto.distinct("codigo",{marca:"In Faucibus Inc."})}})