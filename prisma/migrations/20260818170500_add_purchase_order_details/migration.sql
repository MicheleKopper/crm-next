-- AlterTable
ALTER TABLE "purchase_orders"
  ADD COLUMN "po_date" TIMESTAMP(3),
  ADD COLUMN "po_file" TEXT,
  ADD COLUMN "proforma_number" TEXT,
  ADD COLUMN "proforma_date" TIMESTAMP(3),
  ADD COLUMN "proforma_file" TEXT,
  ADD COLUMN "packing_list_number" TEXT,
  ADD COLUMN "packing_list_date" TIMESTAMP(3),
  ADD COLUMN "packing_list_file" TEXT,
  ADD COLUMN "bl_number" TEXT,
  ADD COLUMN "bl_date" TIMESTAMP(3),
  ADD COLUMN "bl_file" TEXT,
  ADD COLUMN "temp_admission_file" TEXT,
  ADD COLUMN "arrival_date" TIMESTAMP(3),
  ADD COLUMN "observations" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_po_number_key" ON "purchase_orders"("po_number");

-- CreateTable
CREATE TABLE "products_po" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "po_id" UUID NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "size" TEXT,
    "comments" TEXT,
    "is_flexitank" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_po_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "code" TEXT,
    "quantity_kit" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "purchase_order_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accessories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accessories_code_key" ON "accessories"("code");

-- AddForeignKey
ALTER TABLE "products_po" ADD CONSTRAINT "products_po_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_po" ADD CONSTRAINT "products_po_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessories" ADD CONSTRAINT "accessories_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey (recreate flexitanks -> purchase_orders as RESTRICT so deleting a PO with flexitanks fails at the DB level too)
ALTER TABLE "flexitanks" DROP CONSTRAINT "flexitanks_purchase_order_id_fkey";

-- AddForeignKey
ALTER TABLE "flexitanks" ADD CONSTRAINT "flexitanks_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
