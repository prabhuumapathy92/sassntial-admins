import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260927045911 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "contact_submission" add column if not exists "website" text null, add column if not exists "enquiry_type" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "contact_submission" drop column if exists "website", drop column if exists "enquiry_type";`);
  }

}
