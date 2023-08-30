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

    TODO:
    1. active button
    2. continuous mode v 230831
    3. Github link v 230828

    Note:
    git commit --amend -m "commit message" // can amend last commit message
    git rebase -i {commit ID} // can change the commit information from {commit ID} to current commit 
*/
let scrollTime = 250;
let scrollDist = 150;
let interval = 1000/120; // 120 FPS
let minSpeed = 0, maxSpeed = 2;
let power = 1.2;
let scrollMode = 1;
let pressedKeys = {}

function scrollByDistance(x , y, duration){
    let time = 0;
    let count = Math.round(duration / interval);
    let midCount = (count / 2);
    let scroll = setInterval(() => {
        if(time >= count) clearInterval(scroll);
        let dist = (Math.abs((time > midCount ? (count - time)**power : time**power ) - midCount**power )) ** (1/power);    // calculate the distance, but it isn't linear
        let scrollx = x/count * (maxSpeed - (dist/midCount) * (maxSpeed - minSpeed)) * power;   // make the scroll more smooth
        let scrolly = y/count * (maxSpeed - (dist/midCount) * (maxSpeed - minSpeed)) * power;   // make the scroll more smooth
        window.scrollBy(scrollx, scrolly );
        time++;
    }, interval);


}

function scrollByKey(key, distance){
    switch (key){
        case 'j': case 's':  // scroll page to bottom by distance
            scrollByDistance(0, distance, scrollTime);
            break;

        case 'J':   // scroll page to bottom by distance, but double the scroll distance
            scrollByDistance(0, distance*2, scrollTime);
            break;

        case 'k': case 'w':  // scroll page to top by distance
            scrollByDistance(0, -distance, scrollTime);
            break;

        case 'K':   // scroll page to top by distance, but double the scroll distance
            scrollByDistance(0, -distance*2, scrollTime);
            break;

        case 'i':
            scrollByDistance(0, -distance/4, scrollTime);
            break;

        case 'm':
            scrollByDistance(0, distance/4, scrollTime);
            break;

        case 'h': case 'a':  // scroll page to left by distance
            scrollByDistance(-distance, 0, scrollTime);
            break;

        case 'l': case 'd':  // scroll page to right by distance
            scrollByDistance(distance, 0, scrollTime);
            break;

        case 'g':   // scroll to top
            scrollByDistance(0, -window.scrollY, scrollTime * 3);
            break;

        case 'G':   // scroll to bottom
            scrollByDistance(0, document.body.scrollHeight - window.scrollY - window.innerHeight + 150, scrollTime * 3);
            break;
        
        case 'M':   // scroll to middle
            scrollByDistance(0, (document.body.scrollHeight / 2 - window.scrollY - window.screen.height/2), scrollTime * 2);
            break;

        case ' ':
            e.preventDefault();
            break;

        default:
            // ArrowLeft
            break;
    } 
}
 
 
function keyListener(e){
    let tag = e.target.tagName.toLowerCase();
    if( tag == 'input' || tag == 'textarea' || tag == 'div' || scrollMode != 0) return;
    scrollByKey(e.key, scrollDist);
}

console.log("hello Movepage");
window.addEventListener('keydown', (e) => {keyListener(e), pressedKeys[e.key] = true});
window.addEventListener('keyup', (e) => { pressedKeys[e.key] = false})

setInterval(() => {
    if(scrollMode == 1){
        for (let [key, value] of Object.entries(pressedKeys)){
            if(value) scrollByKey(key, scrollDist / 3);
        }
    }
}, 50);
