import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP INDEX IF EXISTS "products_meta_meta_image_1_idx";
  DROP INDEX IF EXISTS "_products_v_version_meta_version_meta_image_1_idx";
  DROP INDEX IF EXISTS "pages_meta_meta_image_1_idx";
  DROP INDEX IF EXISTS "_pages_v_version_meta_version_meta_image_1_idx";
  ALTER TABLE "categories" ADD COLUMN "description" jsonb;
  ALTER TABLE "categories" ADD COLUMN "featured_image_id" integer;
  ALTER TABLE "categories" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "categories" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "categories" ADD COLUMN "display_order" numeric;
  DO $$ BEGIN
   ALTER TABLE "categories" ADD CONSTRAINT "categories_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "categories" ADD CONSTRAINT "categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "products_title_idx" ON "products" USING btree ("title");
  CREATE INDEX IF NOT EXISTS "_products_v_version_version_title_idx" ON "_products_v" USING btree ("version_title");
  CREATE UNIQUE INDEX IF NOT EXISTS "categories_title_idx" ON "categories" USING btree ("title");
  CREATE INDEX IF NOT EXISTS "categories_featured_image_idx" ON "categories" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "categories_meta_meta_image_idx" ON "categories" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "categories_display_order_idx" ON "categories" USING btree ("display_order");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "categories" DROP CONSTRAINT "categories_featured_image_id_media_id_fk";
  
  ALTER TABLE "categories" DROP CONSTRAINT "categories_meta_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "products_title_idx";
  DROP INDEX IF EXISTS "_products_v_version_version_title_idx";
  DROP INDEX IF EXISTS "categories_title_idx";
  DROP INDEX IF EXISTS "categories_featured_image_idx";
  DROP INDEX IF EXISTS "categories_meta_meta_image_idx";
  DROP INDEX IF EXISTS "categories_slug_idx";
  DROP INDEX IF EXISTS "categories_display_order_idx";
  CREATE INDEX IF NOT EXISTS "products_meta_meta_image_1_idx" ON "products" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "_products_v_version_meta_version_meta_image_1_idx" ON "_products_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "pages_meta_meta_image_1_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_version_meta_image_1_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "featured_image_id";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "meta_title";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "meta_image_id";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "meta_description";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "display_order";`)
}
