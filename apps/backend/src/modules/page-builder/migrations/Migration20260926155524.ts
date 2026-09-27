import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260926155524 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cms_page" drop constraint if exists "cms_page_slug_unique";`);
    this.addSql(`create table if not exists "cms_page" ("id" text not null, "slug" text not null, "title" text not null, "breadcrumb_label" text null, "parent_id" text null, "status" text check ("status" in ('draft', 'published')) not null default 'draft', "published_at" timestamptz null, "seo_title" text null, "seo_description" text null, "og_image" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_page_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_page_slug_unique" ON "cms_page" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_deleted_at" ON "cms_page" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "cms_page_block" ("id" text not null, "page_id" text not null, "type" text not null, "position" integer not null default 0, "data" jsonb null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_page_block_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_block_deleted_at" ON "cms_page_block" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cms_page" cascade;`);

    this.addSql(`drop table if exists "cms_page_block" cascade;`);
  }

}
