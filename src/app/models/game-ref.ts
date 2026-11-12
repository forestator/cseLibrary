/** Longest number still taken as an inventory number: a bar code (8 to 13 digits) is not one. */
const MAX_INVENTORY_DIGITS = 6;

function inventoryNumber(ref?: string): number | undefined {
  const digits = ref?.match(/\d+/)?.[0];
  return digits && digits.length <= MAX_INVENTORY_DIGITS ? parseInt(digits, 10) : undefined;
}

/** "ludo12" style references come by number, the highest (the latest purchase) first; the others come last. */
export function compareGameRefs(first?: string, second?: string): number {
  const firstNumber = inventoryNumber(first);
  const secondNumber = inventoryNumber(second);
  if (firstNumber !== undefined && secondNumber !== undefined) {
    return secondNumber - firstNumber;
  }
  if (firstNumber !== undefined) {
    return -1;
  }
  if (secondNumber !== undefined) {
    return 1;
  }
  return 0;
}
