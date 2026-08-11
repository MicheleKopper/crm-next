-- CreateTable
CREATE TABLE "ports" (
    "id" UUID NOT NULL,
    "port_name" TEXT,
    "port_code" TEXT,
    "country_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "product_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" UUID NOT NULL,
    "po_number" TEXT,
    "temp_admission_number" TEXT,
    "temp_admission_date" TIMESTAMP(3),
    "clearence_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "booking" TEXT,
    "ssl_booking_number" TEXT,
    "customer_id" UUID,
    "shipper_id" UUID,
    "consignee_id" UUID,
    "shipping_line_id" UUID,
    "product_id" UUID,
    "port_load_id" UUID,
    "port_discharge_id" UUID,
    "vessel" TEXT,
    "voyage" TEXT,
    "etd" TIMESTAMP(3),
    "atd" TIMESTAMP(3),
    "eta" TIMESTAMP(3),
    "ata" TIMESTAMP(3),
    "mbl_number" TEXT,
    "hbl_number" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "containers" (
    "id" UUID NOT NULL,
    "container" TEXT,
    "tare" INTEGER,
    "seal" TEXT,
    "fitting" TEXT,
    "loading" TEXT,
    "net_weight" TEXT,
    "flexitank_id" UUID,
    "shipment_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flexitanks" (
    "id" UUID NOT NULL,
    "serial_number" TEXT NOT NULL,
    "fhb_stock" TEXT,
    "size" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "location_id" UUID,
    "purchase_order_id" UUID,
    "shipment_id" UUID,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flexitanks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flexitank_depot" (
    "id" UUID NOT NULL,
    "port_id" UUID,
    "company_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flexitank_depot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_shipper_id_fkey" FOREIGN KEY ("shipper_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_consignee_id_fkey" FOREIGN KEY ("consignee_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_shipping_line_id_fkey" FOREIGN KEY ("shipping_line_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_port_load_id_fkey" FOREIGN KEY ("port_load_id") REFERENCES "ports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_port_discharge_id_fkey" FOREIGN KEY ("port_discharge_id") REFERENCES "ports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "containers" ADD CONSTRAINT "containers_flexitank_id_fkey" FOREIGN KEY ("flexitank_id") REFERENCES "flexitanks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "containers" ADD CONSTRAINT "containers_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flexitanks" ADD CONSTRAINT "flexitanks_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flexitanks" ADD CONSTRAINT "flexitanks_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flexitanks" ADD CONSTRAINT "flexitanks_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flexitank_depot" ADD CONSTRAINT "flexitank_depot_port_id_fkey" FOREIGN KEY ("port_id") REFERENCES "ports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flexitank_depot" ADD CONSTRAINT "flexitank_depot_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
