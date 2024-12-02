// simple implementation of csv to JSON
export const csvToJSON = (json: Object[]) => {
  const keys = json.map((entry) => Object.keys(entry)).flat();
  const distinctKeys = Array.from(new Set(keys));
  const csvHeader = distinctKeys.join(",");
  const values = json.map((entry) => Object.values(entry).join(",")).join("\n");
  const csv = `${csvHeader}\n${values}`;
  return csv;
};
