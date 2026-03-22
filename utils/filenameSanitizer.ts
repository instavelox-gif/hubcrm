/**
 * Sanitizes a filename to be compatible with Windows and other operating systems.
 * Replaces invalid characters (< > : " / \ | ? *) with a hyphen.
 * Also handles reserved names (CON, PRN, AUX, NUL, COM1-9, LPT1-9).
 * 
 * @param filename The filename to sanitize
 * @returns The sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  // Replace invalid characters with hyphens
  // Windows invalid characters: < > : " / \ | ? *
  let sanitized = filename.replace(/[<>:"/\\|?*]/g, '-');

  // Remove trailing dots and spaces (invalid in Windows)
  sanitized = sanitized.replace(/[. ]+$/, '');

  // Check for reserved names
  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i;
  if (reservedNames.test(sanitized)) {
    sanitized = `_${sanitized}`;
  }

  // Ensure filename is not empty
  if (sanitized.length === 0) {
    sanitized = 'unnamed_file';
  }

  return sanitized;
}
