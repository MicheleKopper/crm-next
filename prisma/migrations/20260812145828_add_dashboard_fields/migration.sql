-- AlterTable
ALTER TABLE "shipments" ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "shipment_type" TEXT;

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL,
    "customer_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
