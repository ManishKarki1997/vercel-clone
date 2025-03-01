CREATE TYPE "public"."deployment_status" AS ENUM('Running', 'Completed', 'Failed');--> statement-breakpoint
ALTER TABLE "deployments" ALTER COLUMN "status" SET DATA TYPE deployment_status;