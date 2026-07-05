import type { Player } from "@/lib/player-types";
import { PlayerRow } from "@/components/team-roster/PlayerRow";
import { RosterTableColgroup } from "@/components/team-roster/RosterTableColgroup";

interface RosterTableProps {
  players: Player[];
  groupLabel: string;
}

/** Sticky-header, horizontally-scrollable roster table for one position group. */
export function RosterTable({ players, groupLabel }: RosterTableProps) {
  return (
    <div className="tr-table-wrap">
      <div className="tr-table-scroll">
        <table className="tr-table" aria-label={`${groupLabel} roster table`}>
          <RosterTableColgroup />
          <thead>
            <tr>
              <th className="tr-table__th tr-table__th--name" scope="col">
                Name
              </th>
              <th className="tr-table__th" scope="col">
                No.
              </th>
              <th className="tr-table__th" scope="col">
                Pos
              </th>
              <th className="tr-table__th" scope="col">
                Bat
              </th>
              <th className="tr-table__th" scope="col">
                Thw
              </th>
              <th className="tr-table__th" scope="col">
                Age
              </th>
              <th className="tr-table__th" scope="col">
                Ht
              </th>
              <th className="tr-table__th" scope="col">
                Wt
              </th>
              <th className="tr-table__th" scope="col">
                Birth Place
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
