import aesjs from "aes-js";

// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
var key = [1, 2, 3, 1, 4, 5, 6, 7, 8, 40, 9, 32, 11, 40, 23, 90];

const encryption = (text: string) => {
  // "Text may be any length you wish, no padding is required."

  var textBytes = aesjs.utils.utf8.toBytes(text);

  // The counter is optional, and if omitted will begin at 1
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
};

export { encryption };
