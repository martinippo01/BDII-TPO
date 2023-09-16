-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--
-- TABLE: E01_CLIENTE
--
CREATE TABLE IF NOT EXISTS E01_CLIENTE(
    nro_cliente    SERIAL         NOT NULL,
    nombre         VARCHAR(45)    NOT NULL,
    apellido       VARCHAR(45)    NOT NULL,
    direccion      VARCHAR(45)    NOT NULL,
    activo         SMALLINT       NOT NULL,
    CONSTRAINT PK_E01_CLIENTE PRIMARY KEY (nro_cliente)
)
;
--
-- TABLE: E01_DETALLE_FACTURA
--
CREATE TABLE IF NOT EXISTS E01_DETALLE_FACTURA(
    nro_factura        INTEGER    NOT NULL,
    codigo_producto    INTEGER    NOT NULL,
    nro_item           INTEGER    NOT NULL,
    cantidad           FLOAT      NOT NULL,
    CONSTRAINT PK_E01_DETALLE_FACTURA PRIMARY KEY (nro_factura, codigo_producto)
)
;
--
-- TABLE: E01_FACTURA
--
CREATE TABLE IF NOT EXISTS E01_FACTURA(
    nro_factura      INTEGER    NOT NULL,
    fecha            DATE       NOT NULL,
    total_sin_iva    DOUBLE PRECISION     NOT NULL,
    iva              DOUBLE PRECISION     NOT NULL,
    total_con_iva    DOUBLE PRECISION,
    nro_cliente      INTEGER    NOT NULL,
    CONSTRAINT PK_E01_FACTURA PRIMARY KEY (nro_factura)
)
;
--
-- TABLE: E01_PRODUCTO
--
CREATE TABLE IF NOT EXISTS E01_PRODUCTO(
    codigo_producto    SERIAL         NOT NULL,
    marca              VARCHAR(45)    NOT NULL,
    nombre             VARCHAR(45)    NOT NULL,
    descripcion        VARCHAR(45)    NOT NULL,
    precio             FLOAT          NOT NULL,
    stock              INTEGER        NOT NULL,
    CONSTRAINT PK_E01_PRODUCTO PRIMARY KEY (codigo_producto)
)
;
--
-- TABLE: E01_TELEFONO
--
CREATE TABLE IF NOT EXISTS E01_TELEFONO(
    codigo_area     INTEGER    NOT NULL,
    nro_telefono    INTEGER    NOT NULL,
    tipo            CHAR(1)    NOT NULL,
    nro_cliente     INTEGER    NOT NULL,
    CONSTRAINT PK_E01_TELEFONO PRIMARY KEY (codigo_area, nro_telefono)
)
;
--
-- TABLE: E01_DETALLE_FACTURA
--
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   information_schema.table_constraints
    WHERE  constraint_name = 'fk_e01_detalle_factura_producto'
  ) THEN
    ALTER TABLE E01_DETALLE_FACTURA ADD CONSTRAINT FK_E01_DETALLE_FACTURA_PRODUCTO
        FOREIGN KEY (codigo_producto)
        REFERENCES E01_PRODUCTO(codigo_producto)
    ;
  END IF;
END $$;


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   information_schema.table_constraints
    WHERE  constraint_name = 'fk_e01_detalle_factura_factura'
  ) THEN
    ALTER TABLE E01_DETALLE_FACTURA ADD CONSTRAINT FK_E01_DETALLE_FACTURA_FACTURA
    FOREIGN KEY (nro_factura)
    REFERENCES E01_FACTURA(nro_factura)
    ;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   information_schema.table_constraints
    WHERE  constraint_name = 'fk_e01_factura_cliente'
  ) THEN
    ALTER TABLE E01_FACTURA ADD CONSTRAINT FK_E01_FACTURA_CLIENTE
    FOREIGN KEY (nro_cliente)
    REFERENCES E01_CLIENTE(nro_cliente)
    ;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   information_schema.table_constraints
    WHERE  constraint_name = 'fk_e01_telefono_cliente'
  ) THEN
    ALTER TABLE E01_TELEFONO ADD CONSTRAINT FK_E01_TELEFONO_CLIENTE
    FOREIGN KEY (nro_cliente)
    REFERENCES E01_CLIENTE(nro_cliente)
    ;
  END IF;
END $$;



CREATE OR REPLACE PROCEDURE calcular_precios() AS $$
DECLARE
    v_nro_factura INTEGER DEFAULT 0;
    v_codigo_producto INTEGER DEFAULT 0;
    v_cantidad FLOAT DEFAULT 0;
    v_precio DOUBLE PRECISION  DEFAULT 0;
    v_total_sin_iva DOUBLE PRECISION  DEFAULT 0;
    v_precio_final DOUBLE PRECISION  DEFAULT 0;
    v_total_con_iva DOUBLE PRECISION  DEFAULT 0;
    cFacturasIVA CURSOR FOR SELECT nro_factura,total_sin_iva FROM e01_factura;
    cFacturas CURSOR FOR SELECT total_sin_iva FROM e01_factura WHERE nro_factura=v_nro_factura;
    cProducto CURSOR FOR SELECT precio FROM e01_producto WHERE codigo_producto = v_codigo_producto;
    cDetalleFactura CURSOR FOR SELECT codigo_producto, cantidad, nro_factura FROM e01_detalle_factura;
BEGIN
    FOR detalleFactura IN cDetalleFactura LOOP
        v_codigo_producto := detalleFactura.codigo_producto;
        v_cantidad := detalleFactura.cantidad;
        v_nro_factura := detalleFactura.nro_factura;
        FOR producto IN cProducto LOOP
            v_precio := producto.precio;
            IF v_cantidad>10 THEN
                v_precio_final := v_precio*0.9*v_cantidad;
            ELSEIF v_cantidad>5 THEN
                v_precio_final := v_precio*0.95*v_cantidad;
            ELSE
                v_precio_final := v_precio*v_cantidad;
            END IF;
        END LOOP;
        FOR factura IN cFacturas LOOP
            v_total_sin_iva := factura.total_sin_iva;
            v_precio_final := v_precio_final + v_total_sin_iva;
            UPDATE e01_factura
            SET
                total_sin_iva = v_precio_final
            WHERE
                nro_factura = v_nro_factura;
        END LOOP;
    END LOOP;
    FOR facturaIva IN cFacturasIVA LOOP
        v_nro_factura := facturaIva.nro_factura;
        v_total_sin_iva := facturaIva.total_sin_iva;
        v_total_con_iva := v_total_sin_iva + v_total_sin_iva*0.21;
        UPDATE e01_factura
        SET
            total_con_iva = v_total_con_iva
        WHERE
            nro_factura = v_nro_factura;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
CALL calcular_precios () ;

