-- CreateTable
CREATE TABLE "Progress" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "progressBelongsToId" TEXT NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_progressBelongsToId_fkey" FOREIGN KEY ("progressBelongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
