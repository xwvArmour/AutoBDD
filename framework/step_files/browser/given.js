const { Given } = require('cucumber');

const FrameworkPath = process.env.FrameworkPath || process.env.HOME + '/Projects/AutoBDD';
const announceMessage = require(FrameworkPath + '/framework/step_functions/action/announceMessage');
const assignValueOfElementInsideParentElementAs = require(FrameworkPath + '/framework/step_functions/action/assignValueOfElementInsideParentElementAs');
const bypassChromeSafetyWarning = require(FrameworkPath + '/framework/step_functions/action/bypassChromeSafetyWarning');
const checkContainsAnyTextOrValue = require(FrameworkPath + '/framework/step_functions/check/checkContainsAnyTextOrValue');
const checkElementTextValueIsEmpty = require(FrameworkPath + '/framework/step_functions/check/checkElementTextValueIsEmpty');
const checkCondition = require(FrameworkPath + '/framework/step_functions/check/checkCondition');
const checkCookieContent = require(FrameworkPath + '/framework/step_functions/check/checkCookieContent');
const checkCookieExists = require(FrameworkPath + '/framework/step_functions/check/checkCookieExists');
const checkDimension = require(FrameworkPath + '/framework/step_functions/check/checkDimension');
const checkElementExists = require(FrameworkPath + '/framework/step_functions/check/checkElementExists');
const checkContainsEqualsMatchesTextOrValue = require(FrameworkPath + '/framework/step_functions/check/checkContainsEqualsMatchesTextOrValue');
const checkModal = require(FrameworkPath + '/framework/step_functions/check/checkModal');
const checkOffset = require(FrameworkPath + '/framework/step_functions/check/checkOffset');
const checkProperty = require(FrameworkPath + '/framework/step_functions/check/checkProperty');
const checkTitle = require(FrameworkPath + '/framework/step_functions/check/checkTitle');
const checkUrl = require(FrameworkPath + '/framework/step_functions/check/checkURL');
const closeAllButFirstTab = require(FrameworkPath + '/framework/step_functions/action/closeAllButFirstTab');
const compareText = require(FrameworkPath + '/framework/step_functions/check/compareText');
const deleteDownload = require(FrameworkPath + '/framework/step_functions/action/deleteDownload');
const openTarget = require(FrameworkPath + '/framework/step_functions/action/openTarget');
const resizeScreenSize = require(FrameworkPath + '/framework/step_functions/action/resizeScreenSize');

Given(
    /^I announce message(?: at (console|browser))?: "([^"]*)?"$/,
    announceMessage
);

Given(
    /^I assign the (text|value|number) from the(?: (\d+(?:st|nd|rd|th)))? element "([^"]*)?"(?: inside the(?: (\d+(?:st|nd|rd|th)))? parent element "([^"]*)?")? as "(.*)?"$/,
    assignValueOfElementInsideParentElementAs
);

Given(
    /^I (wait and )*bypass chrome safety warning(| if presented)$/,
    bypassChromeSafetyWarning
    );

Given(
    /^I open the (file|download file|path|url) "([^"]*)?"$/,
    openTarget
);

Given(
    /^I delete (the only|all) download file(?:s)? with the name "([^"]*)?"$/,
    deleteDownload
);

Given(
    /^(?:(some|all) of )?the (?:element|checkbox) "([^"]*)?" (is)( not)* (existing|displayed|visible|focused|enabled|clickable|selected|checked)$/,
    checkCondition
);

Given(
    /^there is (an|no) element "([^"]*)?" on the page$/,
    checkElementExists
);

Given(
    /^the element "([^"]*)?" contains( not)* the same text as element "([^"]*)?"$/,
    compareText
);

Given(
    /^the element "([^"]*)?"( not)* (contains|equals|matches) the (text|value|regex) "(.*)?"$/,
    checkContainsEqualsMatchesTextOrValue
);

Given(
    /^the element "([^"]*)?"( not)* contains any (text|value)$/,
    checkContainsAnyTextOrValue
);

Given(
    /^the element "([^"]*)?" (text|value) is( not)* empty$/,
    checkElementTextValueIsEmpty
);

Given(
    /^the page url is( not)* "([^"]*)?"$/,
    (falseCase, value) => {
        checkUrl('full URL', falseCase, 'is', value);
    }
);

Given(
    /^the page title does( not)* (contain|equal|match) the (text|value|regex) "(.*)?"$/,
    checkTitle
);

Given(
    /^the( css)* attribute "([^"]*)?" from element "([^"]*)?" (is|contains|matches)( not)* "(.*)?"$/,
    checkProperty
);

Given(
    /^the cookie "([^"]*)?" contains( not)* the value "([^"]*)?"$/,
    checkCookieContent
);

Given(
    /^the cookie "([^"]*)?" does( not)* exist$/,
    checkCookieExists
);

Given(
    /^the element "([^"]*)?" is( not)* ([\d]+)px (broad|tall)$/,
    checkDimension
);

Given(
    /^the element "([^"]*)?" is( not)* positioned at ([\d]+)px on the (x|y) axis$/,
    checkOffset
);

Given(
    /^I resize browser window to ([\d]+) by ([\d]+) pixels$/,
    resizeScreenSize
);

Given(
    /^I have closed all but the first (window|tab)$/,
    closeAllButFirstTab
);

Given(
    /^a (alertbox|confirmbox|prompt) is( not)* opened$/,
    checkModal
);