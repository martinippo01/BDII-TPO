db.telefono.aggregate([
    {$lookup:
        {
            from: "cliente",
            localField: "nro_cliente",
            foreignField: "nro_cliente",
            as: "cliente"
        }
    }
])