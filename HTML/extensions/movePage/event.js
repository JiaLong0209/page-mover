let active = true

 
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension is Installed');
});

chrome.commands.onCommand.addListener(function (command) {
  console.log('Command:', command);
  if(command == 'toggle_move_page'){
    active = !active;
    console.log(`${active ? 'active' : 'non-active'}`)
  }
});