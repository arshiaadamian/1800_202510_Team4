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
    let figureTemplate = document.getElementById("communityTemplate"); 

    db.collection(collection).get()   
        .then(allCommunity=> {

            allCommunity.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
				var commCode = doc.data().code;    
                var members = doc.data().members; 
                let newfigure = figureTemplate.content.cloneNode(true); 

                //update title and text and image
                newfigure.querySelector('.figure-title').innerHTML = title;
                newfigure.querySelector('.figure-members').innerHTML = members +" Members.";
                newfigure.querySelector('#figure-image').src = `/images/${commCode}.jpg`; 


                document.getElementById(collection + "-go-here").appendChild(newfigure);

            })
        })
}

displayCardsDynamically("community");