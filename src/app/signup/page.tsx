import type { Metadata } from "next";

import { DemoAuthPage } from "@/components/auth/demo-auth-page";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() { return <DemoAuthPage mode="signup" />; }
