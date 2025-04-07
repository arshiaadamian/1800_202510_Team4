const maxDisplayedComms = 4;
var curPage = 0;

function displayCardsDynamically() {
    let figureTemplate = document.getElementById("communityTemplate");
    auth.onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).get().then(doc => {
            let curCom = 0;
            document.getElementById("community-go-here").innerHTML = "";

            doc.data().communities.forEach(communityID => {

                db.collection("community").doc(communityID).get().then(communityDoc => {
                    if (curCom > maxDisplayedComms * curPage && curCom <= (curPage + 1) * maxDisplayedComms && communityDoc.data()) {
                        let title = communityDoc.data().name;       // get value of the "name" key 
                        let members = communityDoc.data().members;
                        let detail = communityDoc.data().detail;
                        let newFigure = figureTemplate.content.cloneNode(true);

                        //update title and text and image
                        newFigure.querySelector('.figure-title').innerHTML = title;
                        newFigure.querySelector('.figure-members').innerHTML = members.length + " Members Joined.";
                        if (!detail) { detail = "No description provided"; }
                        newFigure.querySelector('.figure-details').innerHTML = "Description: " + detail;
                        newFigure.querySelector(".community-join").addEventListener("click", event => {
                            event.preventDefault();
                            window.location.href = `community.html?communityID=${communityID}`;
                        });
                        newFigure.querySelector(".com-click").addEventListener("click", event => {
                            event.preventDefault();
                            window.location.href = `community.html?communityID=${communityID}`;
                        });
                        let storageRef = storage.ref('community_pics/' + communityID);
                        storageRef.getDownloadURL().then(img => {
                            newFigure.querySelector('.com-img').src = img;
                            document.getElementById("community-go-here").appendChild(newFigure);
                        });

                    }
                    if (communityDoc.data()) {
                        curCom++;
                    }
                });

            });
        });
    })
}

displayCardsDynamically();
/*
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
*/
