/** Cast typed API rows to generic table input. */
export const asRecordRows = <T extends object>(rows: T[]): Record<string, unknown>[] =>
  rows.map((r) => ({ ...r }) as Record<string, unknown>);
