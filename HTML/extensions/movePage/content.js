/*      DevLogs
    230821 v0.3.1   add key "hjklwasdmMigG" move page
    230823 v0.3.2   fix minor bug in content.js 

    TODO:
    1. active button
    2. continuous mode
*/
let scrollTime = 250;
let scrollDist = 200;
let interval = 1000/120; // 120 FPS
let minSpeed = 0, maxSpeed = 2;
let power = 1.2;


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

function scrollTop(e){
    scrollByDistance(0, -window.scrollY, scrollTime * 3);
}

function scrollBottom(e){
    scrollByDistance(0, document.body.scrollHeight - window.scrollY - window.innerHeight + 150, scrollTime * 3);
}

function scrollMiddle(e){
    scrollByDistance(0, (document.body.scrollHeight / 2 - window.scrollY - window.screen.height/2), scrollTime * 2);
}
 
function keyListener(e){
    let tag = e.target.tagName.toLowerCase();
    // console.log(tag)
    if( tag == 'input' || tag == 'textarea' || tag == 'div') return;
    switch (e.key){
        
        case 'j': case 's':  // scroll page to bottom by distance
            scrollByDistance(0, scrollDist, scrollTime);
            break;

        case 'J':   // scroll page to bottom by distance, but double the scroll distance
            scrollByDistance(0, scrollDist*2, scrollTime);
            break;

        case 'k': case 'w':  // scroll page to top by distance
            scrollByDistance(0, -scrollDist, scrollTime);
            break;

        case 'K':   // scroll page to top by distance, but double the scroll distance
            scrollByDistance(0, -scrollDist*2, scrollTime);
            break;

        case 'i':
            scrollByDistance(0, -scrollDist/4, scrollTime);
            break;

        case 'm':
            scrollByDistance(0, scrollDist/4, scrollTime);
            break;

        case 'h': case 'a':  // scroll page to left by distance
            scrollByDistance(-scrollDist, 0, scrollTime);
            break;

        case 'l': case 'd':  // scroll page to right by distance
            scrollByDistance(scrollDist, 0, scrollTime);
            break;

        case 'g':   // scroll to top
            scrollTop(e);
            break;

        case 'G':   // scroll to bottom
            scrollBottom(e);
            break;
        
        case 'M':   // scroll to middle
            scrollMiddle(e);
            break;

        case ' ':
            e.preventDefault();
            break;

        default:
            // ArrowLeft
            break;
    } 
}

console.log("hello Movepage");
window.addEventListener('keydown', (e) => {keyListener(e)});



