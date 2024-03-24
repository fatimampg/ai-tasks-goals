/*
  Warnings:

  - The values [ONGOING] on the enum `GOAL_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GOAL_STATUS_new" AS ENUM ('ACHIEVED', 'IN_PROGRESS', 'NEEDS_IMPROVEMENT');
ALTER TABLE "Goal" ALTER COLUMN "status" TYPE "GOAL_STATUS_new" USING ("status"::text::"GOAL_STATUS_new");
ALTER TYPE "GOAL_STATUS" RENAME TO "GOAL_STATUS_old";
ALTER TYPE "GOAL_STATUS_new" RENAME TO "GOAL_STATUS";
DROP TYPE "GOAL_STATUS_old";
COMMIT;

-- AlterTable
ALTER TABLE "Goal" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
