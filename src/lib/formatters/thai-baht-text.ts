/**
 * Convert number to Thai Baht Text representation (แปลงตัวเลขเป็นตัวอักษรภาษาไทย)
 * Example: 3000 -> "สามพันบาทถ้วน"
 * Example: 1540.50 -> "หนึ่งพันห้าร้อยสี่สิบบาทห้าสิบสตางค์"
 */
export function thaiBahtText(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount.replace(/,/g, "")) : amount;
  if (isNaN(num) || num === 0) return "ศูนย์บาทถ้วน";

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const [integerPart, decimalPart = ""] = absNum.toFixed(2).split(".");

  const thaiDigits = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const thaiPositions = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  function convertGroup(digitsStr: string): string {
    let result = "";
    const len = digitsStr.length;

    for (let i = 0; i < len; i++) {
      const digit = parseInt(digitsStr[i], 10);
      const pos = len - i - 1;

      if (digit === 0) continue;

      if (pos === 1 && digit === 1) {
        result += "สิบ";
      } else if (pos === 1 && digit === 2) {
        result += "ยี่สิบ";
      } else if (pos === 0 && digit === 1 && len > 1 && digitsStr[len - 2] !== "0") {
        result += "เอ็ด";
      } else {
        result += thaiDigits[digit] + thaiPositions[pos];
      }
    }

    return result;
  }

  let text = "";
  let intLen = integerPart.length;

  if (intLen > 6) {
    const millionsGroup = integerPart.slice(0, intLen - 6);
    const remainderGroup = integerPart.slice(intLen - 6);
    text = convertGroup(millionsGroup) + "ล้าน" + convertGroup(remainderGroup);
  } else {
    text = convertGroup(integerPart);
  }

  text += "บาท";

  const satang = parseInt(decimalPart.slice(0, 2), 10);
  if (satang === 0) {
    text += "ถ้วน";
  } else {
    text += convertGroup(satang.toString().padStart(2, "0")) + "สตางค์";
  }

  return isNegative ? "ลบ" + text : text;
}
