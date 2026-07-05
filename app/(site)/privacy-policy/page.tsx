import { InfoPage } from "@/components/info-page";

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="Policy"
      title="Privacy Policy"
      paragraphs={[
        "The Sports Rivalry collects the minimum operational data needed to run analytics, newsletters, and site reliability checks, and does not present sponsorship or newsletter capture as newsroom content.",
        "Any personal data submitted through forms or mailing lists is processed only for the stated purpose and handled according to the platform and vendor policies connected to that workflow.",
      ]}
    />
  );
}
