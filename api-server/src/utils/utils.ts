export function getRange(page: number = 1, limit: number = 10) {
  const from = page * limit;
  const to = from + limit - 1;

  return [from, to];
}