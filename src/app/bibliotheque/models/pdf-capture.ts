const SRGB_COLOR = /^color\(srgb\s+([\d.e-]+)\s+([\d.e-]+)\s+([\d.e-]+)(?:\s*\/\s*([\d.e-]+%?))?\)$/;

function toRgb(value: string): string | undefined {
  const match = SRGB_COLOR.exec(value);
  if (!match) {
    return undefined;
  }
  const [red, green, blue] = match.slice(1, 4).map(channel => Math.round(Number(channel) * 255));
  const alpha = match[4]?.endsWith('%') ? Number.parseFloat(match[4]) / 100 : Number(match[4] ?? 1);
  return `rgb(${red} ${green} ${blue} / ${alpha})`;
}

/**
 * Prepares the clone html2canvas renders: the page is printed in the light scheme, and the `color(srgb …)` values
 * browsers compute for color-mix() (which html2canvas cannot parse) are rewritten as plain rgb colours.
 */
export function prepareForCapture(clone: Document): void {
  const view = clone.defaultView;
  if (!view) {
    return;
  }
  clone.documentElement.style.colorScheme = 'light';
  for (const element of Array.from(clone.querySelectorAll<HTMLElement>('*'))) {
    const style = view.getComputedStyle(element);
    for (const property of Array.from(style)) {
      const value = style.getPropertyValue(property);
      if (property.startsWith('--') || !value.includes('color(')) {
        continue;
      }
      // Shadows and gradients mix several values; dropping them is harmless for a printout.
      element.style.setProperty(property, toRgb(value) ?? 'none', 'important');
    }
  }
}
