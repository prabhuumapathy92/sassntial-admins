import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260926152325 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "nav_item" ("id" text not null, "menu" text not null, "parent_id" text null, "label" text not null, "href" text null, "icon" text null, "media" jsonb null, "rank" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "nav_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_nav_item_deleted_at" ON "nav_item" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "nav_item" cascade;`);
  }

}
