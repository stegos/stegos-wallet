Object.fromEntries = arr =>
  Object.assign({}, ...arr.map(([k, v]) => ({ [k]: v })));
Object.filter = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));
Object.sort = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).sort(predicate));
