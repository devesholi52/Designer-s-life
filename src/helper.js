export const mobileValidation = (number) => {
    if (number.length < 10) {
        return false
    }
    else {
        return true
    }
}
export const discountValidation = (number) => {
    if (number > 100) {
        return false
    }
    else {
        return true
    }
}