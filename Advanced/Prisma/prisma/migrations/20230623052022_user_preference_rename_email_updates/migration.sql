/*
  Warnings:

  - You are about to drop the column `emailUpdated` on the `UserPreferences` table. All the data in the column will be lost.
  - Made the column `age` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `emailUpdates` to the `UserPreferences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "emailUpdated",
ADD COLUMN     "emailUpdates" BOOLEAN NOT NULL;
