/*
  Warnings:

  - You are about to drop the column `deadlineDay` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `deadlineMonth` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `deadlineYear` on the `Task` table. All the data in the column will be lost.
  - Added the required column `deadline` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "deadlineDay",
DROP COLUMN "deadlineMonth",
DROP COLUMN "deadlineYear",
ADD COLUMN     "deadline" DATE NOT NULL;
