DROP INDEX "user_deployment_id_idx";--> statement-breakpoint
CREATE INDEX "user_deployment_id_idx" ON "deployment_logs" USING btree ("user_id","deployment_id");