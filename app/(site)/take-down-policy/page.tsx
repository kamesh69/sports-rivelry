import { InfoPage } from "@/components/info-page";

export default function TakeDownPolicyPage() {
  return (
    <InfoPage
      eyebrow="Policy"
      title="Take Down Policy"
      paragraphs={[
        "Requests to remove or substantially alter published material are reviewed case by case, with a bias toward corrections, clarifications, or updates rather than deletion.",
        "When legal or safety concerns require faster review, Sports Rivalry logs the request, evaluates supporting evidence, and responds with the least disruptive action consistent with accuracy and responsibility.",
      ]}
    />
  );
}
