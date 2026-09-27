import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260926161535 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cms_post" drop constraint if exists "cms_post_slug_unique";`);
    this.addSql(`create table if not exists "cms_post" ("id" text not null, "slug" text not null, "title" text not null, "excerpt" text null, "cover_image" text null, "category" text null, "tags" jsonb null, "author_name" text null, "author_role" text null, "author_avatar" text null, "status" text check ("status" in ('draft', 'published')) not null default 'draft', "published_at" timestamptz null, "reading_minutes" integer not null default 1, "seo_title" text null, "seo_description" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_post_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_post_slug_unique" ON "cms_post" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_post_deleted_at" ON "cms_post" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "cms_post_block" ("id" text not null, "post_id" text not null, "type" text not null, "position" integer not null default 0, "data" jsonb null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_post_block_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_post_block_deleted_at" ON "cms_post_block" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cms_post" cascade;`);

    this.addSql(`drop table if exists "cms_post_block" cascade;`);
  }

}
