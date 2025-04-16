/**
 * Format phone number to E.164 format
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
function formatToE164(phoneNumber) {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if number starts with country code
  if (cleaned.length === 10) {
    return `+1${cleaned}`; // Add US country code
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  return phoneNumber; // Return original if format unknown
}

/**
 * Validate phone number format
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - Whether the number is valid
 */
function isValidPhoneNumber(phoneNumber) {
  const regex = /^\+?1?\d{10,11}$/;
  return regex.test(phoneNumber.replace(/\D/g, ''));
}

module.exports = {
  formatToE164,
  isValidPhoneNumber
}; 