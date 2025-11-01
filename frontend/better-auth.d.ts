import "better-auth";

declare module "better-auth" {
  interface BetterAuthUser {
    bio?: string; // 👈 add your custom field
  }
}
