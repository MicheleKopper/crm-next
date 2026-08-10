-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "owner_id" UUID,
    "status" TEXT NOT NULL DEFAULT 'Novo',
    "source" TEXT NOT NULL,
    "campaign" TEXT,
    "urgency" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "currency" TEXT,
    "modal" TEXT NOT NULL,
    "estimated_volume" INTEGER NOT NULL,
    "volume_unit" TEXT NOT NULL,
    "pain_identified" TEXT,
    "interest" TEXT,
    "disqualification_reason" TEXT,
    "last_interaction_at" TIMESTAMP(3),
    "converted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "work_phone" TEXT,
    "extension" TEXT,
    "job_title" TEXT NOT NULL,
    "birthday" DATE,
    "language" TEXT NOT NULL DEFAULT 'Português',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_lead_id_key" ON "contacts"("lead_id");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
