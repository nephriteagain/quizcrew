export function fontSizeScaler(text: string) {
    const length = text.length;

    if (length > 100) return 8;
    if (length > 80) return 9;
    if (length > 60) return 10;
    if (length > 40) return 11;
    if (length > 30) return 12;
    if (length > 20) return 13;
    if (length > 15) return 14;
    if (length > 10) return 15;

    return 16;
}