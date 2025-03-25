const maxDisplayedComms = 6;

function displayCardsDynamically(collection) {
    let figureTemplate = document.getElementById("communityTemplate");

    db.collection(collection).get()
        .then(allCommunity => {
            displayedComms = 0;
            allCommunity.forEach(doc => { //iterate thru each doc
                displayedComms++;
                if (displayedComms > maxDisplayedComms) { return; }
                var title = doc.data().name;       // get value of the "name" key 
                var members = doc.data().members;
                var detail = doc.data().detail;
                let newFigure = figureTemplate.content.cloneNode(true);

                //update title and text and image
                newFigure.querySelector('.figure-title').innerHTML = title;
                newFigure.querySelector('.figure-members').innerHTML = members.length + " Members Joined.";
                if (!detail) { detail = "No description provided"; }
                newFigure.querySelector('.figure-details').innerHTML = "Description: " + detail;
                let storageRef = storage.ref('community_pics/' + doc.id);
                storageRef.getDownloadURL().then(img => {
                    newFigure.querySelector('.com-img').src = img;
                    document.getElementById(collection + "-go-here").appendChild(newFigure);

                });

            });
        });
}

displayCardsDynamically("community");

