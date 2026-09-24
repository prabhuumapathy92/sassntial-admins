import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260924033001 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "contact_page" ("id" text not null, "intro" text null, "general_inquiries_email" text null, "support_line" text null, "availability" text null, "focus_items" jsonb null, "form_eyebrow" text null, "form_heading" text null, "form_description" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "contact_page_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_contact_page_deleted_at" ON "contact_page" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "contact_submission" ("id" text not null, "full_name" text not null, "company" text null, "email" text not null, "phone_number" text null, "location" text null, "message" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "contact_submission_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_contact_submission_deleted_at" ON "contact_submission" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "contact_page" cascade;`);

    this.addSql(`drop table if exists "contact_submission" cascade;`);
  }

}
