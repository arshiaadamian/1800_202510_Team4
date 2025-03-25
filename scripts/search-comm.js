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
