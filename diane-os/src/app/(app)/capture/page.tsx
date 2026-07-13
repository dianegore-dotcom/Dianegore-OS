import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { CaptureForm } from "@/components/forms/capture-form";
import { getFormOptions } from "@/lib/data";

export const metadata: Metadata = { title: "Quick capture" };

export default async function CapturePage() {
  const options = await getFormOptions();
  return (
    <>
      <PageHeader title="Quick capture" description="Capture first. Organize later. Only the main text is required." />
      <Card className="mx-auto max-w-4xl"><CaptureForm vaults={options.vaults} areas={options.areas} projects={options.projects} /></Card>
    </>
  );
}
