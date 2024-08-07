/*
  Warnings:

  - You are about to drop the column `customerId` on the `Queue` table. All the data in the column will be lost.
  - Added the required column `name` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Queue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Queue" ("createdAt", "id", "position", "reason", "status", "updatedAt") SELECT "createdAt", "id", "position", "reason", "status", "updatedAt" FROM "Queue";
DROP TABLE "Queue";
ALTER TABLE "new_Queue" RENAME TO "Queue";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
