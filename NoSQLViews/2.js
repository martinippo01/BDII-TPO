var facturados = db.factura.aggregate([
    { $unwind: "$detalle_factura" },
    { $group: { _id: null, codigo_productos: { $addToSet: "$detalle_factura.codigo_producto" } } },
    { $project: { _id: 0, codigo_productos: 1 } } // Project only the "codigo_productos" field
]).toArray();

var facturadosCodes = facturados[0].codigo_productos;

var pipeline_view_2 = [
    {
        $match: {
            codigo : {
                $nin: facturadosCodes
            }
        }
    }
]
db.createView("productos_not_facturado", "producto", pipeline_view_2)

// Insertar un producto nuevo (Estamos seguro que no se haya facturado)
db.producto.insertOne({
    codigo: 101,
    descripcion: "No facturado",
    marca: "Fia",
    nombre: "Nuevo",
    precio: 20.5,
    stock: 12
})