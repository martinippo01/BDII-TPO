db.cliente.aggregate([
    { $lookup:
       {
         from: 'factura',
         localField: 'nro_cliente',
         foreignField: 'nro_cliente',
         as: 'facturas'
       }
     },
     {
     $project:{
       nombre:"$nombre",
       apellid:"$apellido",
       suma: {$size:"$facturas"}
     }
     }

])