(function () {

    let scrollTime = 250;
    let scrollDist = 150;
    let interval = 1000 / 120; // 120 FPS
    let minSpeed = 0, maxSpeed = 2;
    let power = 1.2;
    let pressedKeys = {}
    let contDistOffset = 6;
    let contDurationOffset = 2;
    let contInterval = interval * 4;
    let xOffset = 10 * (contDistOffset / 3) / contDurationOffset * contInterval / 33;   // fix the moving distance difference when move down/up

    let Status = {
        active: true,
        activeMode: 1,          // 0 = non-continuous, 1 = continuous
        scrollMode: 'linear',   // nonlinear, nonlinear_power or linear
    }

    function scrollByDistance(x, y, duration) {

        let step = 0;
        let totalSteps = Math.round(duration / interval);
        let midSteps = (totalSteps / 2);
        let dist, scrollx, scrolly;
        let scroll = setInterval(() => {
            if (step >= totalSteps) clearInterval(scroll);

            if (Status.scrollMode == 'nonlinear_power') {
                dist = (Math.abs((step > midSteps ? (totalSteps - step) ** power : step ** power) - midSteps ** power)) ** (1 / power);    // calculate the distance between current step and midSteps, but it isn't linear
                scrollx = x / totalSteps * (maxSpeed - (dist / midSteps) * (maxSpeed - minSpeed)) * power;  // the current step will reach maxSpeed at midSteps. Instead,
                scrolly = y / totalSteps * (maxSpeed - (dist / midSteps) * (maxSpeed - minSpeed)) * power;  // the farther dist, the closer the scrolling speed is to minSpeed.

            } else if (Status.scrollMode == 'nonlinear') {
                dist = Math.abs((step > midSteps ? (totalSteps - step) : step) - midSteps)
                scrollx = x / totalSteps * (maxSpeed - (dist / midSteps) * (maxSpeed - minSpeed));
                scrolly = y / totalSteps * (maxSpeed - (dist / midSteps) * (maxSpeed - minSpeed));

            } else if (Status.scrollMode == 'linear') {
                scrollx = x / totalSteps
                scrolly = y / totalSteps

            }
            window.scrollBy(scrollx, scrolly);
            step++;
        }, interval);


    }

    function scrollByKey(e, distance, duration, shiftKey) {
        if (!Status.active) return;
        let shiftBonus = shiftKey ? 2 : 1
        switch (e.key.toLowerCase()) {
            case 'j': case 's':  // scroll page to bottom by distance
                scrollByDistance(0, distance * shiftBonus + xOffset, duration)
                break;

            case 'k': case 'w':  // scroll page to top by distance
                scrollByDistance(0, -distance * shiftBonus, duration);
                break;

            case 'h': case 'a':  // scroll page to left by distance
                scrollByDistance(-distance * shiftBonus, 0, duration);
                break;

            case 'l': case 'd':  // scroll page to right by distance
                scrollByDistance(distance * shiftBonus, 0, duration);
                break;

            case 'i':
                scrollByDistance(0, -distance * shiftBonus / 4, duration);
                break;

            case 'm':
                shiftKey ?
                    // scroll to middle of webpage, shiftKey
                    scrollByDistance(0, (document.body.scrollHeight / 2 - window.scrollY - window.screen.height / 2), duration * 3) :
                    // scroll page down with small distance
                    scrollByDistance(0, distance * shiftBonus / 4 + xOffset, duration);
                break;

            case 'g':
                shiftKey ?
                    // scroll to bottom, shiftKey
                    scrollByDistance(0, document.body.scrollHeight - window.scrollY - window.innerHeight + 150, duration * 5) :
                    // scroll to top
                    scrollByDistance(0, -window.scrollY, duration * 5);
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

    function keydownListener(e) {
        pressedKeys[e.key.toLowerCase()] = true;
        let tag = e.target.tagName.toLowerCase();
        if (isInputArea(tag) || Status.activeMode != 0) return;
        scrollByKey(e, scrollDist, scrollTime, e.shiftKey);
    }

    function keyupListener(e) {
        pressedKeys[e.key.toLowerCase()] = false;
    }

    function chromeOnMessage(message, sender, sendResponse) {
        pressedKeys = {};
        Status = message
        console.log(sender);
        sendResponse(Status);
    }

    chrome.runtime.onMessage.addListener(chromeOnMessage);

    // console.log("hello Movepage");
    console.log("%c Hello PageMover!", "font-weight: bold; font-size: 20px;color: #a52; text-shadow: 1px 1px 0 rgb(217,31,38), 2px 2px 0px rgb(245,221,8), 3px 3px 0 rgb(2,135,206), 4px 4px 0px rgb(42,21,113); margin: 10px; padding: 5px");
    window.addEventListener('keydown', (e) => { keydownListener(e) });
    window.addEventListener('keyup', (e) => { keyupListener(e) })

    setInterval(() => {
        if (Status.active && !isInputArea(document.activeElement.tagName) && Status.activeMode == 1) {
            for (let [key, value] of Object.entries(pressedKeys)) {
                if (value) scrollByKey(new KeyboardEvent('keydown', { key: key }), scrollDist / contDistOffset, scrollTime / contDurationOffset, pressedKeys['shift']);
            }
        }
    }, contInterval);


})()

/*      DevLogs

230821 v0.3.0 Add key "hjklwasdmMigG" move page
230822 v0.3.1 Remove unnecessary code in content.js
230823 v0.3.2 Fix minor bug in content.js 
230824 v0.4.0 Optimize movePageByKey UI
230824 v0.4.1 Rename movePageByKey to movePage
230824 v0.4.2 Change favicon
230824 v0.4.3 Add background script
230828 v0.4.4 Add github link
230828 v0.5.0 Change open link method (create tab)
230828 v0.5.1 Optimize the github link UI
230829 v0.6.0 Add commands key
230830 v0.7.0 Add active move page to context menus
230831 v0.7.1 Remove necessary code in content.js
230831 v0.8.0 Add continuous scroll mode 
230901 v0.8.1 Fix move page active in input area 
230901 v0.8.2 Fix up/down moving distance difference 
230901 v0.8.3 Change argument 'e.key' to 'e' in scrollByKey function
230901 v0.8.4 Fix move page not work in continuous scroll mode
230904 v0.9.0 Add open new tab shortcut "Alt+N" and a context menu button
230904 v0.9.1 Add 'nonlinear' and 'linear' scroll mode
230904 v0.9.2 Rename 'times', 'count' , 'midCount' to 'step', 'totalSteps', 'midSteps' in content.js
230904 v0.9.3 Adjust scrolling related parameters and optimize the scrolling distance offset
230904 v0.9.4 Adjust continuous mode interval parameters and optimize scrolling smoothness
230905 v0.9.5 Fix bugs when pressing Shift in continuous mode and rewrite scrollByKey function in content.js
230905 v0.9.6 Update popup.html
230913 v0.9.7 Add active variable in content.js
230914 v0.9.8 Fix click 'active page mover' not working, and rename variables
230914 v0.9.9 Encapsulate extension status related variables into the 'Status' variable
230914 v0.9.9 Update extension version numbers in manifest.json
230915 v0.9.9.1 Change greeting text style in console log
230922 v1.0.0 Split this extension to a separate repository
230922 v1.0.1 Create LICENSE and README files

        TODO:
    Github link                  v 230828
    continuous mode              v 230831
    bug in continuous mode when pressing Shift key v 230905
    

    *active button in popup.html
    *toggle scroll mode 
    *remember extension status in different window
    *change greeting text style in console 
    *pressing space key to slow the scrolling speed

        Note:
    git commit --amend -m "commit message" // can amend last commit message
    git rebase -i {commit ID} // can change the commit information from {commit ID} to current commit 
*/