import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260926163705 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cms_post_category" drop constraint if exists "cms_post_category_slug_unique";`);
    this.addSql(`create table if not exists "cms_author" ("id" text not null, "name" text not null, "role" text null, "avatar" text null, "bio" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_author_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_author_deleted_at" ON "cms_author" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "cms_post_category" ("id" text not null, "name" text not null, "slug" text not null, "description" text null, "rank" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_post_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_post_category_slug_unique" ON "cms_post_category" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_post_category_deleted_at" ON "cms_post_category" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "cms_post" drop column if exists "category", drop column if exists "author_name", drop column if exists "author_role", drop column if exists "author_avatar";`);

    this.addSql(`alter table if exists "cms_post" add column if not exists "category_id" text null, add column if not exists "author_id" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cms_author" cascade;`);

    this.addSql(`drop table if exists "cms_post_category" cascade;`);

    this.addSql(`alter table if exists "cms_post" drop column if exists "category_id", drop column if exists "author_id";`);

    this.addSql(`alter table if exists "cms_post" add column if not exists "category" text null, add column if not exists "author_name" text null, add column if not exists "author_role" text null, add column if not exists "author_avatar" text null;`);
  }

}
