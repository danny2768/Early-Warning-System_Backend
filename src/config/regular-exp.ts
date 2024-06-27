
export const regularExps = {    
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    phone: {
        countryCode: /^\+\d{1,3}$/, // Matches + followed by 1 to 3 digits
        number: /^\d{7,15}$/, // Matches 7 to 15 digits
    },
};

