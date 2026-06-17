import { InfoPage } from "@/components/info-page";

export default function FAQsPage() {
  return (
    <InfoPage
      eyebrow="FAQs"
      title="Frequently Asked Questions"
      paragraphs={[
        "Sports Rivalry covers the biggest rivalry-led stories across marquee sports, with an emphasis on why the matchup matters, what changed, and what comes next.",
        "If you need a correction, attribution update, or commercial contact, use the listed policy and contact pages so the right editor can route the request quickly.",
      ]}
    />
  );
}
