const numberFormater = (value = 0) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    if (!isNaN(numericValue)) {
        const parts = numericValue.toString().split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const decimalPart = parts.length > 1 ? `,${parts[1]}` : '';
        return `${integerPart}${decimalPart}`;
    }
    return value;
};

export default numberFormater;
