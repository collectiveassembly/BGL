BGL
===

BMW Guggenheim Lab

### TECHNICAL OVERVIEW

6 projectors display 6 full-screen Chrome Browser windows each running the exact same page and script. The address of the pages encodes the position of the screen relative to the other windows. For example, the top left corner's url would be ```http://[address]/#0,0```, and the one below it would be ```http://[address]/#0,1```. 

The entire page is not displayed, but a scroll offset is set on the page to position it in the correct spot. This cuts development time down because the team is only working on a single large page and the synchronization and distribution of the page across multiple projectors is all handled behind the scenes. It also allow for debugging and testing with a multi-computer / multi-screen setup and on a single computer just as easily. 

A Node.js server runs on one of the computers and send synchronized messages to all connected windows. The messages contain the terms which should be displayed on the screen as well as other events like triggering the Lab Logo periodically. 

### RUNNING THE SERVER

* make sure node.js is installed on the computer
* open Terminal (Applications/Utilities/Terminal)
* cd to the directory
* type ```node app.js```
* open Chrome and go to 127.0.0.1:3000