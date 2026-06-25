/**
 * Converts a name or word string into Title Case.
 * Example: "mohit sharma" -> "Mohit Sharma"
 * 
 * @param {string} str - The raw input string
 * @returns {string} - The Title Case formatted string
 */
export const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
