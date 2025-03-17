

function displayCardsDynamically(collection) {
    let figureTemplate = document.getElementById("communityTemplate"); 

    db.collection(collection).get()   
        .then(allCommunity=> {

            allCommunity.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
				var commCode = doc.data().code;    
                var members = doc.data().members; 
                var detail = doc.data().detail;
                let newfigure = figureTemplate.content.cloneNode(true); 

                //update title and text and image
                newfigure.querySelector('.figure-title').innerHTML = title;
                newfigure.querySelector('.figure-members').innerHTML = members +" Member Joined.";
                newfigure.querySelector('.figure-details').innerHTML = "Description: " + detail;
                newfigure.querySelector('#figure-image').src = `/images/${commCode}.jpg`; 


                document.getElementById(collection + "-go-here").appendChild(newfigure);

            })
        })
}

displayCardsDynamically("community");