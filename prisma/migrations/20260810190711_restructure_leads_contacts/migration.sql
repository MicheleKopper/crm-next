/*
  Warnings:

  - You are about to drop the column `lead_id` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `leads` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `leads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_lead_id_fkey";

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_company_id_fkey";

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_owner_id_fkey";

-- DropIndex
DROP INDEX "contacts_lead_id_key";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "lead_id",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "pronoun" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "job_title" DROP NOT NULL,
ALTER COLUMN "language" DROP NOT NULL;

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "company_id",
DROP COLUMN "owner_id",
ADD COLUMN     "contact_id" UUID,
ADD COLUMN     "customer_id" UUID NOT NULL,
ADD COLUMN     "operator_id" UUID;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
