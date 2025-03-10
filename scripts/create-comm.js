function writeCommunity() {
    var communityRef = db.collection("community");
    communityRef.add({
        code: "I1",
        name: "Insanity in a Game", 
        location: "North America",
		details: "A community to play valorant with people! You can play any game just join!",
        members: 823,
        last_updated: firebase.firestore.FieldValue.serverTimestamp() 
    });
    communityRef.add({
        code: "I2",
        name: "Marvel Rivalers", 
        location: "North America",
		details: "A community to find players and teams for Marvel Rivals.",
        members: 273,
        last_updated: firebase.firestore.FieldValue.serverTimestamp() 
    });
    communityRef.add({
        code: "I3",
        name: "Role-Playing Community", 
        location: "North America",
		details: "A community to role-play with others! All role-playing based games included.",
        members: 543,
        last_updated: firebase.firestore.FieldValue.serverTimestamp() 
    });
}

function displayCardsDynamically(collection) {
    let figureTemplate = document.getElementById("communityTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
        .then(allCommunity=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allCommunity.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
				var commCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                var members = doc.data().members; //gets the length field
                let newfigure = figureTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newfigure.querySelector('.figure-title').innerHTML = title;
                newfigure.querySelector('.figure-members').innerHTML = members +" Members.";
                newfigure.querySelector('#figure-image').src = `/images/${commCode}.jpg`; //Example: NV01.jpg

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newfigure);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("community");