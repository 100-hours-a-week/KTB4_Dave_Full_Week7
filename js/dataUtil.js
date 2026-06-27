export function formatCount(count){
    if(count >= 1000){
        return Math.floor(count/1000) + "K";
    }
}

export function formatDateTime(dateTime){
    const datePart = createdAt.slice(0, 10);
    const timePart = createdAt.slice(11, 16);

    return `${datePart} ${timePart}`;
}