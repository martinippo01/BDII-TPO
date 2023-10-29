var pipeline = [
    {
        $sort: {
            fecha: 1
        }
    }
];
db.createView("facturas_ordenada", "factura", pipeline);