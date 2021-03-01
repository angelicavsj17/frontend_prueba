let substractDays = (date = new Date(), days = 0) => {
    date.setDate(date.getDate() - days)
    return date
}
let addDays = (date = new Date(), days = 0) => {
    date.setDate(date.getDate() + days)
    return date
}

let startOfTheDay = (start = new Date()) => {
    start.setHours(0, 0, 0, 0);
    return start;
}

let endOfTheDay = (end = new Date()) => {
    end.setHours(23, 59, 59, 999);
    return end;
}

let addMonths = (date, months) => {
    return new Date(date.setMonth(date.getMonth() + months));
}

module.exports = {
    substractDays,
    addDays,
    startOfTheDay,
    endOfTheDay,
    addMonths
}