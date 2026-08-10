"use client";

import { RotateCcw, Save, Shield, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";

import { DemoBanner } from "@/components/app/demo-banner";
import { PageHeading } from "@/components/app/page-heading";
import { usePlan } from "@/features/plans/plan-provider";

export default function SettingsPage() {
  const { plan, setProfileName, loadDemo, startBlank } = usePlan();
  const [saved, setSaved] = useState(false);

  function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setProfileName(String(data.get("profileName") ?? ""));
    setSaved(true);
  }

  return <><DemoBanner /><section className="page-shell max-w-4xl py-10 sm:py-14"><PageHeading eyebrow="Settings" title="Your local CreditMap" description="Change the plan name or reset the locally saved competition data. No sensitive student information is collected." />
    <div className="mt-8 space-y-5">
      <form className="rounded-3xl border border-[var(--line)] bg-white p-6" onSubmit={saveName}><h2 className="text-lg font-extrabold text-[var(--brand-950)]">Plan profile</h2><label className="mt-5 block"><span className="form-label">Plan name</span><input className="form-input mt-2" defaultValue={plan.profileName} name="profileName" /></label><button className="primary-button mt-4" type="submit"><Save aria-hidden="true" className="size-4" />Save name</button>{saved && <p className="mt-3 text-sm font-semibold text-[var(--success-strong)]" role="status">Plan name saved on this device.</p>}</form>
      <section className="rounded-3xl border border-[var(--line)] bg-white p-6"><div className="flex gap-3"><Shield aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--brand-700)]" /><div><h2 className="text-lg font-extrabold text-[var(--brand-950)]">Privacy</h2><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">This demo uses browser storage. It does not request a student ID, address, birth date, transcript, or financial information. Production accounts will use Supabase Row Level Security.</p></div></div></section>
      <section className="rounded-3xl border border-red-100 bg-white p-6"><h2 className="text-lg font-extrabold text-[var(--brand-950)]">Reset local data</h2><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">These actions affect only this browser.</p><div className="mt-5 flex flex-wrap gap-3"><button className="secondary-button" onClick={loadDemo} type="button"><RotateCcw aria-hidden="true" className="size-4" />Restore sample demo</button><button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-bold text-red-700 hover:bg-red-50" onClick={() => startBlank(plan.universityId)} type="button"><Trash2 aria-hidden="true" className="size-4" />Delete credits and start blank</button></div></section>
    </div>
  </section></>;
}
