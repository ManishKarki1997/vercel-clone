ALTER TABLE "projects" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "git_url" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "branch" varchar(255) DEFAULT 'main';--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_slug_unique" UNIQUE("slug");