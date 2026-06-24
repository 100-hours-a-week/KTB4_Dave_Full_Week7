export function checkStringLength(str, min, max) {
    return str.length >= min && str.length <= max;
}

export function checkWhiteSpace(str){
    return /\s/.test(str);
}

export function checkEmailStyle(str) {
    const reg = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/;
    return reg.test(str);
}

export function checkPasswordStyle(str) {
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const number = /[0-9]/;
    const symbol = /[\~\!\@\#\$\%\^\&\*]/;
    return upperCase.test(str) && lowerCase.test(str) &&
    number.test(str) && symbol.test(str);
} 

export function confirmPassword(str1, str2){
    return str1 === str2;
}
console.log(checkPasswordStyle("asdfA123!"));