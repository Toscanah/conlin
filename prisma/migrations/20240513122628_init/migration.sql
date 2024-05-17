-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "lunch_orders" DROP NOT NULL,
ALTER COLUMN "dinner_orders" DROP NOT NULL,
ALTER COLUMN "lunch_time" DROP NOT NULL,
ALTER COLUMN "dinner_time" DROP NOT NULL;
