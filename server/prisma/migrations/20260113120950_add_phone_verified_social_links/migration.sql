-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "company" TEXT,
    "position" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "profilePhoto" TEXT,
    "tagline" TEXT,
    "bio" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" DATETIME,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerifiedAt" DATETIME,
    "communityVerified" BOOLEAN NOT NULL DEFAULT false,
    "socialLinks" TEXT,
    "chapterId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("bio", "chapterId", "city", "communityVerified", "company", "createdAt", "email", "emailVerified", "emailVerifiedAt", "firstName", "id", "lastName", "password", "phone", "position", "profilePhoto", "tagline", "updatedAt") SELECT "bio", "chapterId", "city", "communityVerified", "company", "createdAt", "email", "emailVerified", "emailVerifiedAt", "firstName", "id", "lastName", "password", "phone", "position", "profilePhoto", "tagline", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_chapterId_idx" ON "User"("chapterId");
CREATE INDEX "User_emailVerified_idx" ON "User"("emailVerified");
CREATE INDEX "User_communityVerified_idx" ON "User"("communityVerified");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
