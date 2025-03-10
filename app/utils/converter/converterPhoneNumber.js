function convertPhoneNumber(phoneNumber) {
    phoneNumber = String(phoneNumber).trim(); // Konversi ke string & hapus spasi di awal/akhir

    if (!/^[\d+]+$/.test(phoneNumber)) return false;

    if (phoneNumber.startsWith("08")) {
        return "628" + phoneNumber.slice(2);
    } else if (phoneNumber.startsWith("+628")) {
        return phoneNumber.slice(1);
    } else if (phoneNumber.startsWith("628")) {
        return phoneNumber;
    } else {
        return false;
    }
}

module.exports ={ convertPhoneNumber}
