function convertPhoneNumber(phoneNumber) {
    if (phoneNumber.startsWith('08')) {
        return '628' + phoneNumber.slice(2);
    } else if (phoneNumber.startsWith('+628')) {
        return phoneNumber.slice(1);
    } else if (phoneNumber.startsWith('628')) {
        return phoneNumber;
    } else {
        return null;
    }
}

module.exports ={ convertPhoneNumber}
