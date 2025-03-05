var fileInput = document.getElementById("pfp-input");
var pfpDisplay = document.getElementById("pfp");


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

fileInput.addEventListener("change", event => {
    auth.onAuthStateChanged(user => {
        // Checks if a user is signed in
        if (user) {
            let pfp = fileInput.files[0];

            var reader = new FileReader();
            reader.addEventListener('load', (e) => {
                let pfpRef = storage.ref().child(`/pfps/${user.uid}.png`);
                console.log(e.target.result);
                let data = e.target.result;
                data = data.split(";")[1].split(",")[1];

                let blob = b64toBlob(data, "img/png")
                
                pfpRef.put(blob).then((picture) => {
                    console.log("Saving users picture");
                    getUserPicture();
                });
            });
            reader.readAsDataURL(pfp);

            

        }
    });
});

