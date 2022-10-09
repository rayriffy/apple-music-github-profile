-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "appleRefreshToken" TEXT NOT NULL,
    "appleMusicToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");
