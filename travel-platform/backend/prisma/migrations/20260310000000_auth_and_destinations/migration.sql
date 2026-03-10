-- Rename enum UserRole to Role
ALTER TYPE "UserRole" RENAME TO "Role";

-- Add featured flag for destinations
ALTER TABLE "Destination"
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
