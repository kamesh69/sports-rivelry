import { InfoPage } from "@/components/info-page";

export default function TermsOfUsePage() {
  return (
    <InfoPage
      eyebrow="Policy"
      title="Terms of Use"
      paragraphs={[
        "By using Sports Rivalry, readers agree to access the site lawfully, avoid abusive or automated misuse, and respect the intellectual property attached to published stories, artwork, and branding.",
        "Sports Rivalry may update features, policies, or content formats over time, but continues to separate editorial judgment from commercial activity and to publish clear trust information for readers.",
      ]}
    />
  );
}
