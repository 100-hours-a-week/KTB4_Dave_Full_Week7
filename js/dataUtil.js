export function formatCount(count){
    if(count >= 1000){
        return Math.floor(count/1000) + "K";
    }
    else{
        return count;
    }
}

export function formatDateTime(dateTime){
    const datePart = dateTime.slice(0, 10);
    const timePart = dateTime.slice(11, 16);

    return `${datePart} ${timePart}`;
}