db.producto.find({codigo:{$in:db.factura.distinct("detalle_factura.codigo_producto")}})
