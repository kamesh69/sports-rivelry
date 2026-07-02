import type { Player, PositionGroup } from "@/lib/player-types";
import { RosterTable } from "@/components/team-roster/RosterTable";

interface RosterSectionProps {
  group: PositionGroup;
  players: Player[];
}

/** One position-group block: heading + count + its own roster table. */
export function RosterSection({ group, players }: RosterSectionProps) {
  if (players.length === 0) return null;

  return (
    <section className="tr-roster-section td-fadein" aria-label={`${group} roster`}>
      <div className="tr-roster-section__head">
        <h2 className="tr-roster-section__title">{group}</h2>
        <span className="tr-roster-section__count">{players.length}</span>
      </div>
      <RosterTable players={players} groupLabel={group} />
    </section>
  );
}
