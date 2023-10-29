// Fetch the distinct "nro_cliente" values from the "factura" collection
var distinctNroClientes = db.factura.distinct("nro_cliente");

// Find "cliente" documents where "nro_cliente" is not in the distinctNroClientes array
db.cliente.find({ nro_cliente: { $nin: distinctNroClientes } });