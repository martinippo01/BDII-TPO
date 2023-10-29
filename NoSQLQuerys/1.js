db.cliente.aggregate([
    {$lookup:
        {
            from: "telefono",
            localField: "nro_cliente",
            foreignField: "nro_cliente",
            as: "telefono"
        }
    },
    {
        $match: {
            nombre: "Wanda",
            apellido: "Baker"
        }
    },
    {
        $project: {
            telefono: 1,
            _id: 0 // Exclude the default "_id" field
        }
    }
])