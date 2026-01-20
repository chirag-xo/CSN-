-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profilePhotoPublicId" TEXT;

-- AlterTable
ALTER TABLE "GalleryPhoto" ADD COLUMN IF NOT EXISTS "cloudinaryPublicId" TEXT;
