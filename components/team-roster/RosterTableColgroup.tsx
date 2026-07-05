/** Shared column widths — keeps every position-group table aligned. */
export function RosterTableColgroup() {
  return (
    <colgroup>
      <col className="tr-table__col tr-table__col--name" />
      <col className="tr-table__col tr-table__col--num" />
      <col className="tr-table__col tr-table__col--pos" />
      <col className="tr-table__col tr-table__col--bat" />
      <col className="tr-table__col tr-table__col--thw" />
      <col className="tr-table__col tr-table__col--age" />
      <col className="tr-table__col tr-table__col--ht" />
      <col className="tr-table__col tr-table__col--wt" />
      <col className="tr-table__col tr-table__col--birth" />
    </colgroup>
  );
}
