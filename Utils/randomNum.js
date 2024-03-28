const randomNumber = () => {
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    // return  Math.floor(1000 + Math.random() * 9000);
};
export { randomNumber };
