import NextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // 👈 add id
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
