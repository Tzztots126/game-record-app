-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "comment" TEXT,
    "screenshots" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'playing',
    "rating" INTEGER,
    "playTime" REAL,
    "completedAt" DATETIME
);
