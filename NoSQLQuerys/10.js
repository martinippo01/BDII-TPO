db.factura.aggregate([
    {
        $lookup: {
            from: "cliente",
            localField: "nro_cliente",
            foreignField: "nro_cliente",
            as: "cliente_info"
        }
    },
    {
        $unwind: "$cliente_info"
    },
    {
        $group: {
            _id: "$nro_cliente",
            total_monto: { $sum: "$total_con_iva" },
            nombre: { $first: "$cliente_info.nombre" },
            apellido: { $first: "$cliente_info.apellido" }
        }
    }
])