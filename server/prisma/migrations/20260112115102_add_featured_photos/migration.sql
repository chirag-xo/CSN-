-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GalleryPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredAt" DATETIME,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GalleryPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GalleryPhoto" ("caption", "id", "uploadedAt", "url", "userId") SELECT "caption", "id", "uploadedAt", "url", "userId" FROM "GalleryPhoto";
DROP TABLE "GalleryPhoto";
ALTER TABLE "new_GalleryPhoto" RENAME TO "GalleryPhoto";
CREATE INDEX "GalleryPhoto_userId_idx" ON "GalleryPhoto"("userId");
CREATE INDEX "GalleryPhoto_uploadedAt_idx" ON "GalleryPhoto"("uploadedAt");
CREATE INDEX "GalleryPhoto_isFeatured_idx" ON "GalleryPhoto"("isFeatured");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
