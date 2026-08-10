import type { Metadata } from "next";

import { DemoAuthPage } from "@/components/auth/demo-auth-page";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() { return <DemoAuthPage mode="login" />; }
