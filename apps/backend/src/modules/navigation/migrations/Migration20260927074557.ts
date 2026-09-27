import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260927074557 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "footer_settings" drop constraint if exists "footer_settings_key_unique";`);
    this.addSql(`create table if not exists "footer_settings" ("id" text not null, "key" text not null, "data" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "footer_settings_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_footer_settings_key_unique" ON "footer_settings" ("key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_footer_settings_deleted_at" ON "footer_settings" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "footer_settings" cascade;`);
  }

}
