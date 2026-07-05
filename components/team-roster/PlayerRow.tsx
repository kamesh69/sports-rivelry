import { memo } from "react";
import type { Player } from "@/lib/player-types";
import { PlayerAvatar } from "@/components/team-roster/PlayerAvatar";

interface PlayerRowProps {
  player: Player;
}

function PlayerRowImpl({ player }: PlayerRowProps) {
  return (
    <tr className="tr-table__row">
      <td className="tr-table__cell tr-table__cell--name" data-label="Name">
        <div className="tr-table__player">
          <PlayerAvatar src={player.image} name={player.name} size={32} />
          <span className="tr-table__player-name">{player.name}</span>
        </div>
      </td>
      <td className="tr-table__cell" data-label="No.">
        {player.jerseyNumber}
      </td>
      <td className="tr-table__cell" data-label="Pos">
        {player.position}
      </td>
      <td className="tr-table__cell" data-label="Bat">
        {player.bat}
      </td>
      <td className="tr-table__cell" data-label="Thw">
        {player.throw}
      </td>
      <td className="tr-table__cell" data-label="Age">
        {player.age}
      </td>
      <td className="tr-table__cell" data-label="Ht">
        {player.height}
      </td>
      <td className="tr-table__cell" data-label="Wt">
        {player.weight}
      </td>
      <td className="tr-table__cell tr-table__cell--birthplace" data-label="Birth Place">
        {player.birthPlace}
      </td>
    </tr>
  );
}

export const PlayerRow = memo(PlayerRowImpl);
