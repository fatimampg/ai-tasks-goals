-- CreateEnum
CREATE TYPE "TASK_STATUS" AS ENUM ('TO_DO', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TASK_PRIORITY" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateEnum
CREATE TYPE "GOAL_STATUS" AS ENUM ('ACHIEVED', 'IN_PROGRESS', 'NEEDS_IMPROVEMENT');

-- CreateEnum
CREATE TYPE "CATEGORY" AS ENUM ('CAREER', 'PERSONAL_DEVELOPMENT', 'HEALTH_AND_WELLNESS', 'FINANCIAL', 'FAMILY_AND_FRIENDS', 'LEISURE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "belongsToId" TEXT NOT NULL,
    "status" "TASK_STATUS" NOT NULL DEFAULT 'IN_PROGRESS',
    "percentageCompleted" INTEGER,
    "priority" "TASK_PRIORITY" NOT NULL DEFAULT 'MODERATE',
    "relatedGoalId" INTEGER,
    "category" "CATEGORY",

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "belongsToId" TEXT NOT NULL,
    "category" "CATEGORY" NOT NULL,
    "status" "GOAL_STATUS" NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Task_id_belongsToId_key" ON "Task"("id", "belongsToId");

-- CreateIndex
CREATE UNIQUE INDEX "Goal_id_belongsToId_key" ON "Goal"("id", "belongsToId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_relatedGoalId_fkey" FOREIGN KEY ("relatedGoalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
