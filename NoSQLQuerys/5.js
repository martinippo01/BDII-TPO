db.cliente.aggregate([
    {$lookup:
        {
            from: "telefono",
            localField: "nro_cliente",
            foreignField: "nro_cliente",
            as: "telefono"
        }
    }
])