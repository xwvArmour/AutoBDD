/**
 * Check if the given element exists in the DOM one or more times
 * @param  {String}  targetElement      target element selector
 * @param  {Boolean} falseCase          Check if the element (does not) exists
 * @param  {String}  parentElementIndex The nth parent element start from 1st,2nd,3rd,4th
 * @param  {String}  parentElement      parent element selector
 * @param  {String}  compareAction      compare action: more than, less than, exactly
 * @param  {String}  expectedNumber     Check if the element exists this number (as string) of times
 */
module.exports = (targetElement, parentElementIndex, parentElement, falseCase, compareAction, expectedNumber) => {
    const parentElementIndexInt = (parentElementIndex) ? parseInt(parentElementIndex) - 1 : 0;
    const myExpectedNumber = (expectedNumber) ? parseInt(expectedNumber) : 0;

    var appearanceNumber;
    if (parentElement) {
        const parentElementId = browser.elements(parentElement).value[parentElementIndexInt].ELEMENT
        appearanceNumber = browser.elementIdElements(parentElementId, targetElement).value.length;
    } else {
        appearanceNumber = browser.elements(targetElement).value.length;
    }

    switch (compareAction) {
        case 'exactly':
            if (falseCase) {
                expect(appearanceNumber).not.toEqual(parseInt(myExpectedNumber));
            }
            else {
                expect(appearanceNumber).toEqual(parseInt(myExpectedNumber))
            }
            break;
        case 'less than':
            if (falseCase) {
                expect(appearanceNumber).not.toBeLessThan(parseInt(myExpectedNumber));
            }
            else {
                expect(appearanceNumber).toBeLessThan(parseInt(myExpectedNumber))
            }
            break;
        default:
        case 'more than':
            if (falseCase) {
                expect(appearanceNumber).not.toBeGreaterThan(parseInt(myExpectedNumber));
            }
            else {
                expect(appearanceNumber).toBeGreaterThan(parseInt(myExpectedNumber))
            }
    }    
};