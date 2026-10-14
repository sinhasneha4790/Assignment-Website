-- Trigram search and spelling suggestions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- AlterTable
ALTER TABLE "Colour" ADD COLUMN     "family" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "fabricType" TEXT,
ADD COLUMN     "fitNote" TEXT,
ADD COLUMN     "modelInfo" TEXT,
ADD COLUMN     "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "searchText" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sort" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_searchText_idx" ON "Product" USING GIN ("searchText" gin_trgm_ops);

