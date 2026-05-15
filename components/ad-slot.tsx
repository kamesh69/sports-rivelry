interface AdSlotProps {
  label?: string;
}

export function AdSlot({ label = "Ad-ready placement" }: AdSlotProps) {
  return (
    <div className="ad-slot" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}
