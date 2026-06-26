import { InfoPage } from "@/components/info-page";

export default function FactCheckingPolicyPage() {
  return (
    <InfoPage
      eyebrow="Policy"
      title="Fact Checking Policy"
      paragraphs={[
        "Sports Rivalry checks names, scores, dates, quotes, injury details, standings context, and source framing before publication, especially on fast-moving rivalry and breaking-news pieces.",
        "When facts change after publication, the article is updated with clearer wording, corrected context, or an explicit correction note depending on the size and impact of the error.",
      ]}
    />
  );
}
