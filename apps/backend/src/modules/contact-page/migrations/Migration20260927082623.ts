import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260927082623 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "contact_email_settings" ("id" text not null, "enabled" boolean not null default false, "smtp_host" text null, "smtp_port" integer not null default 587, "smtp_secure" boolean not null default false, "smtp_require_tls" boolean not null default true, "smtp_username" text null, "smtp_password_encrypted" text null, "from_name" text null, "from_email" text null, "to_emails" jsonb null, "reply_to_submitter" boolean not null default true, "subject_prefix" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "contact_email_settings_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_contact_email_settings_deleted_at" ON "contact_email_settings" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "contact_email_settings" cascade;`);
  }

}
