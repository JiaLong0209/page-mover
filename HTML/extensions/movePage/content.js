/*      DevLogs
    230821 v0.3.0   add key "hjklwasdmMigG" move page
    230822 v0.3.1   remove unnecessary code in content.js
    230823 v0.3.2   fix minor bug in content.js 
    230824 v0.4.0   optimize movePageByKey UI
    230824 v0.4.1   rename movePageByKey to movePage
    230824 v0.4.2   change favicon
    230824 v0.4.3   add background script
    230828 v0.4.4   add github link
    230828 v0.5.0   change open link method (create tab)
    230828 v0.5.1   optimize the github link UI
    230829 v0.6.0   add commands key
    230830 v0.7.0   add active move page to context menus
    230831 v0.7.1   remove necessary code in content.js
    230831 v0.8.0   add continuous scroll mode 
    230901 v0.8.1   fix move page active in input area 
    230901 v0.8.2   fix up/down moving distance difference 
    230901 v0.8.3   change argument 'e.key' to 'e' in scrollByKey function
    230901 v0.8.4   fix move page not work in continuous scroll mode
    230904 v0.9.0   add open new tab shortcut "Alt+N" and a context menu button
    230904 v0.9.1   add 'nonlinear' and 'linear' scroll mode
    230904 v0.9.2   rename 'times', 'count' , 'midCount' to 'step', 'totalSteps', 'midSteps' in content.js

        TODO:
    Github link                  v 230828
    continuous mode              v 230831
    *active button
    *toggle scroll mode 

        Note:
    git commit --amend -m "commit message" // can amend last commit message
    git rebase -i {commit ID} // can change the commit information from {commit ID} to current commit 
*/
let scrollTime = 200;
let scrollDist = 150;
let interval = 1000 / 120; // 120 FPS
let minSpeed = 0, maxSpeed = 2;
let power = 1.2;
let activeMode = 0; // 0 = non-continuous, 1 = continuous
let scrollMode = 'linear' // nonlinear, nonlinear_power or linear
let pressedKeys = {}
let xOffset = 10;

function scrollByDistance(x, y, duration) {

    let step = 0;
    let totalSteps = Math.round(duration / interval);
    let midSteps = (totalSteps / 2);
    let dist, scrollx, scrolly;
    let scroll = setInterval(() => {
        if (step >= totalSteps) clearInterval(scroll);

        if (scrollMode == 'nonlinear_power') {
            dist = (Math.abs((step > midSteps ? (totalSteps - step) ** power : step ** power) - midSteps ** power)) ** (1 / power);    // calculate the distance between current step and midSteps, but it isn't linear
            scrollx = x / totalSteps * (maxSpeed - (dist / midSteps) * (maxSpeed - minSpeed)) * power;  // the current step will reach maxSpeed at midSteps. Instead,
            scrolly = y / totalSteps * (maxSpeed - (dist / midSteps) * (maxSpeed - minSpeed)) * power;  // the farther dist, the closer the scrolling speed is to minSpeed.

        } else if (scrollMode == 'nonlinear') {
            dist = Math.abs((step > midSteps ? (totalSteps - step) : step) - midSteps)
            scrollx = x / totalSteps * (maxSpeed - (dist / midSteps) * (maxSpeed - minSpeed));
            scrolly = y / totalSteps * (maxSpeed - (dist / midSteps) * (maxSpeed - minSpeed));

        } else if (scrollMode == 'linear') {
            scrollx = x / totalSteps
            scrolly = y / totalSteps

        }
        window.scrollBy(scrollx, scrolly);
        step++;
    }, interval);


}

function scrollByKey(e, distance, duration) {
    switch (e.key) {
        case 'j': case 's':  // scroll page to bottom by distance
            scrollByDistance(0, distance + xOffset, duration);
            break;

        case 'J':   // scroll page to bottom by distance, but double the scroll distance
            scrollByDistance(0, distance * 2 + xOffset, duration);
            break;

        case 'k': case 'w':  // scroll page to top by distance
            scrollByDistance(0, -distance, duration);
            break;

        case 'K':   // scroll page to top by distance, but double the scroll distance
            scrollByDistance(0, -distance * 2, duration);
            break;

        case 'i':
            scrollByDistance(0, -distance / 4, duration);
            break;

        case 'm':
            scrollByDistance(0, distance / 4 + xOffset, duration);
            break;

        case 'h': case 'a':  // scroll page to left by distance
            scrollByDistance(-distance, 0, duration);
            break;

        case 'l': case 'd':  // scroll page to right by distance
            scrollByDistance(distance, 0, duration);
            break;

        case 'g':   // scroll to top
            scrollByDistance(0, -window.scrollY, duration * 3);
            break;

        case 'G':   // scroll to bottom
            scrollByDistance(0, document.body.scrollHeight - window.scrollY - window.innerHeight + 150, duration * 3);
            break;

        case 'M':   // scroll to middle
            scrollByDistance(0, (document.body.scrollHeight / 2 - window.scrollY - window.screen.height / 2), duration * 2);
            break;

        case ' ':
            e.preventDefault();
            break;

        default:
            // ArrowLeft
            break;
    }
}

function isInputArea(tag) {
    tag = tag.toLowerCase();
    return tag == 'input' || tag == 'textarea' || tag == 'div';

}

function keyListener(e) {
    let tag = e.target.tagName.toLowerCase();
    if (isInputArea(tag) || activeMode != 0) return;
    scrollByKey(e, scrollDist, scrollTime);
}

console.log("hello Movepage");
window.addEventListener('keydown', (e) => { keyListener(e), pressedKeys[e.key] = true });
window.addEventListener('keyup', (e) => { pressedKeys[e.key] = false })

setInterval(() => {
    if (!isInputArea(document.activeElement.tagName) && activeMode == 1) {
        for (let [key, value] of Object.entries(pressedKeys)) {
            if (value) scrollByKey(new KeyboardEvent('keydown', { key: key }), scrollDist / 6, scrollTime / 2);
        }
    }
}, 33);
