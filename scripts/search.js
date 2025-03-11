const search = document.getElementById("searchButton");
search.addEventListener("click", async function(){
    const searchInputValue = document.getElementById("searchInput").value.toLowerCase();
    const user = auth.currentUser;
    if(!user){
        console.log("user does not exist");
        return;
    }

    const allUsersSnapShot = await db.collection("users").get();
    let foundUser = null;
    allUsersSnapShot.forEach(function(doc){
        const userData = doc.data();
        //console.log(userData);
        const currentUserName = userData.username.toLowerCase();
        if(currentUserName === searchInputValue){
            foundUser = userData;
        }
    })
    
    if(!foundUser){
        alert("no user found");
    }else{
        document.getElementById("resultsBox").innerHTML = "Search results"
        document.getElementById("firstImage").src = foundUser.img;
        document.getElementById("name1").innerHTML = foundUser.name;
        document.getElementById("description1").innerHTML = "I am " + foundUser.age + " years old.";
        const allCards = document.querySelectorAll(".card");
        allCards.forEach(function(card){
            card.style.display = "none";
        })
        document.querySelector(".card-display").style.display = "block";

    }



})