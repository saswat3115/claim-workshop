export function numberFormat(num: number) {
    if (num <= 999) {
        return String(num);
    }

    const value = Math.floor(num / 1000);

    if (value <= 1) {
        return '1k';
    }

    return `${value}K`;
}
