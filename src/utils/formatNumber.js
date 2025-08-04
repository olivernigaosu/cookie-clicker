export function formatNumber(value) {
  if (value >= 1_000_000_000_000) {
    return parseFloat((value / 1_000_000_000_000).toFixed(3)) + ' Trillion';
  } else if (value >= 1_000_000_000) {
    return parseFloat((value / 1_000_000_000).toFixed(3)) + ' Billion';
  } else if (value >= 1_000_000) {
    return parseFloat((value / 1_000_000).toFixed(3)) + ' Million';
  } else if (value >= 1_000) {
    return Number(value.toFixed()).toLocaleString();
  } else {
    return Number.isInteger(value)
      ? value.toFixed(0)
      : value.toFixed(1);
  }
}


