const maxDisplayedComms = 4;
var curPage = 0;

function displayCardsDynamically(collection) {
    let figureTemplate = document.getElementById("communityTemplate");

    db.collection(collection).get()
        .then(allCommunity => {
            let curCom = 0;
            document.getElementById(collection + "-go-here").innerHTML = "";
            allCommunity.forEach(doc => { //iterate thru each doc
                if (curCom > maxDisplayedComms * curPage && curCom <= (curPage + 1) * maxDisplayedComms) {
                    let title = doc.data().name;       // get value of the "name" key 
                    let members = doc.data().members;
                    let detail = doc.data().detail;
                    let newFigure = figureTemplate.content.cloneNode(true);

                    //update title and text and image
                    newFigure.querySelector('.figure-title').innerHTML = title;
                    newFigure.querySelector('.figure-members').innerHTML = members.length + " Members Joined.";
                    if (!detail) { detail = "No description provided"; }
                    newFigure.querySelector('.figure-details').innerHTML = "Description: " + detail;
                    newFigure.querySelector(".community-join").addEventListener("click", event => {
                        db.collection("users").doc(auth.currentUser.uid).update({
                            communities: firebase.firestore.FieldValue.arrayUnion(doc.id)
                        }).then(() => {
                            window.location.href = `community.html?communityID=${doc.id}`;
                        });
                    });
                    newFigure.querySelector(".com-click").addEventListener("click", event => {
                        event.preventDefault();
                        db.collection("users").doc(auth.currentUser.uid).update({
                            communities: firebase.firestore.FieldValue.arrayUnion(doc.id)
                        }).then(() => {
                            window.location.href = `community.html?communityID=${doc.id}`;
                        });
                    });
                    let storageRef = storage.ref('community_pics/' + doc.id);
                    storageRef.getDownloadURL().then(img => {
                        newFigure.querySelector('.com-img').src = img;
                        document.getElementById(collection + "-go-here").appendChild(newFigure);
                    });
                    
                }
                curCom++;
            });
        });
}

displayCardsDynamically("community");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

nextBtn.addEventListener("click", event => {
    event.preventDefault();
    curPage++;
    displayCardsDynamically("community");
});

prevBtn.addEventListener("click", event => {
    event.preventDefault();
    if (curPage > 0) {
        curPage--;
        displayCardsDynamically("community");
    }
});
