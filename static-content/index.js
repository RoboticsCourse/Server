function getRecent() {
        $.ajax({
                method: "GET",
                url: "/getInfo/"
        }).done(function (data) {
                $("#sensors").html(data.data);
        });
}

function getFSInfo(fw, sp) {
        radius = 15
        if (Math.pow(fw, 2) + Math.pow(sp, 2) <= Math.pow(radius, 2)) {
                return "Bucket 4: Stopped";
        }

        bin1Size = parseInt((255 * 2 + 1) / 3);
        bin1Num = parseInt((fw + 254) / bin1Size);

        bin2Size = parseInt((150 * 2 + 1) / 3);
        bin2Num = parseInt((sp + 149) / bin2Size);

        binNum = bin1Num + 3 * bin2Num;
        if (binNum == 3) {
                if (sp > 0) {
                        return "Bucket 6: Forward Left";
                }
                return "Bucket 0: Backward Left";
        }
        else if (binNum == 4) {
                if (sp > 0) {
                        return "Bucket 3: Slightly Forward";
                }
                return "Bucket 5: Slightly Backward";
        }
        else if (binNum == 5) {
                if (sp > 0) {
                        return "Bucket 8: Forward Right";
                }
                return "Bucket 2: Backward Right";
        }
        else {
                return "Bucket 7: Forward";
        }
}

function getPairInfo() {
        $.ajax({
                method: "GET",
                url: "/getPairs/"
        }).done(function (data) {
                var cards = "";
                var pairs = data.success;
                for (var i = 0; i < pairs.length; i++) {
                        cards += "</br></br><div class='card'><img id='img' " + "src='images/" + pairs[i]["Image Time"] + ".jpg' " + "height='500' width='350'></br><p>Image Time:" + pairs[i]["Image Time"] + " </br> Data Time: " + pairs[i]["Data Time"] + " </br>  Direction/Location: " + getFSInfo(pairs[i]["Forward"], pairs[i]["Speed"]) + " </br>  Forward: " + pairs[i]["Forward"] + " </br> Speed: " + pairs[i]["Speed"] + " </br> Sensor 1: " + pairs[i]["Sensor1"] + " </br> Sensor 2: " + pairs[i]["Sensor2"] + " </br> State: " + pairs[i]["State"] + " </br></p></div>"
                }
                $("#gallery").html(cards);
        });
}

function displayMSG(success, error){
        $("#success").hide();
        $("#error").hide();

        if (success != ""){
                $("#success").show();
                $("#success").html(success);
        }
        else if (error != ""){
                $("#error").show();
                $("#error").html(error);
        }
}

function getJSON() {
        displayMSG("Getting JSON File","");
        $.ajax({
                method: "GET",
                url: "/getJSON/"
        }).done(function (data) {
                if (data.success){
                        var link = document.createElement("a");
                        link.download = data.filename;
                        link.href = data.path;
                        link.click();
                        displayMSG("Started Downloading JSON","");
                }
                else {
                        displayMSG("",data.error); 
                }
        });
}

function getDB() {
        displayMSG("Zipping DB Folder","");
        $.ajax({
                method: "GET",
                url: "/getDB/"
        }).done(function (data) {
                if (data.success){
                        var link = document.createElement("a");
                        link.download = data.filename;
                        link.href = data.path;
                        link.click();
                        displayMSG("Started Downloading DB","");
                }
                else {
                        displayMSG("",data.error); 
                }
        });
}

function getModel() {
        displayMSG("Zipping Model Folder","");
        $.ajax({
                method: "GET",
                url: "/getModel/"
        }).done(function (data) {
                if (data.success){
                        var link = document.createElement("a");
                        link.download = data.filename;
                        link.href = data.path;
                        link.click();
                        displayMSG("Started Downloading Model","");
                }
                else {
                        displayMSG("",data.error); 
                }
        });
}

function getFiles() {
        displayMSG("Zipping Images and JSON","");
        $.ajax({
                method: "GET",
                url: "/getFiles/"
        }).done(function (data) {
                if (data.success){
                        var link = document.createElement("a");
                        link.download = data.filename;
                        link.href = data.path;
                        link.click();
                        displayMSG("Started Downloading Files","");
                }
                else {
                        displayMSG("",data.error); 
                }
        });
}

function clearDB() {
        clearData()
        clearImages()
        clearPairs()
}

function clearData() {
        $.ajax({
                method: "GET",
                url: "/clearDBData/"
        }).done(function (data) {
                if (data.success){
                        displayMSG("Data cleared from DB","");
                }
                else {
                        displayMSG("",data.error);
                }
        });
}

function clearImages() {
        $.ajax({
                method: "GET",
                url: "/clearDBImgs/"
        }).done(function (data) {
                if (data.success){
                        displayMSG("Images cleared from DB","");
                }
                else {
                        displayMSG("",data.error);
                }
        });
}

function clearPairs() {
        $.ajax({
                method: "GET",
                url: "/clearDBPair/"
        }).done(function (data) {
                if (data.success){
                        displayMSG("Pairs cleared from DB","");
                }
                else {
                        displayMSG("",data.error);
                }
        });
}

function clearModel() {
        displayMSG("Started Clearing Model Files","");
        $.ajax({
                method: "GET",
                url: "/clearModel/"
        }).done(function (data) {
                if (data.success){
                        displayMSG("Model Files Cleared","");
                }
                else {
                        displayMSG("",data.error);
                }
        });
}

function confirmation(){
        let val = document.getElementById("confirm").value;
        document.getElementById("confirm").value = "";
        if (val == "Confirmed"){
                return true;
        }
        displayMSG("","Enter 'Confirmed' to press button");
        return false;
}

function createImages(){
        displayMSG("Started making images","");
        let val = (document.getElementById("splitInfo").value)
        console.log(val)
        val = val.split(" ");
        console.log(val)
        path = "./static-content/videos/" + val[0]
        time = val[1]
        $.ajax({
                method: "PUT",
                url: "/createImages/",
                data: {"path": path, "time": time}
        }).done(function (data) {
                displayMSG(data,"");
        });
}

function createPairs(){
        displayMSG("Started making pairs","");
        $.ajax({
                method: "GET",
                url: "/createPairs/"
        }).done(function (data) {
                displayMSG(data,"");
        });
}

function getVideoFiles(){
        $.ajax({
                method: "GET",
                url: "/getVideos/"
        }).done(function (data) {
                if (data.success){
                        files = data.Files.join('<br>');
                        $("#videoList").html(files);
                }
                else {
                        displayMSG("",data.error);
                }
        });
}

function uploadVideo(){
        var file_data = $("#file").prop("files")[0];
        console.log(file_data.name)
        var form_data = new FormData();
	form_data.append("file", file_data) 
        displayMSG("Uploading File","");
        $.ajax({
                method: "POST",
                url: "/uploadVid/",
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
        }).done(function (data) {
                if (!data.success){
                        displayMSG("File Uploaded","");
                }
                else {
                        displayMSG("",data.error);
                }
                
        });
}

$(function () {
        $("#success").hide();
        $("#error").hide();
        var testingInterval;
        var videoInterval;
        var picInterval;
        $("#pics").on('click', function () {
                picInterval = setInterval(function () {
                        getPairInfo();
                }, 60000);
                clearInterval(testingInterval);
                clearInterval(videoInterval);
                $("#img").show();
                $("#test").hide();
                $("#server").hide();
                getPairInfo();
        });
        $("#testing").on('click', function () {
                testingInterval = setInterval(function () {
                        getRecent();
                }, 1000);
                clearInterval(picInterval);
                clearInterval(videoInterval);
                $("#test").show();
                $("#img").hide();
                $("#server").hide();
                getRecent();
        });
        $("#control").on('click', function () {
                videoInterval = setInterval(function () {
                        getVideoFiles()
                }, 5000);
                clearInterval(testingInterval);
                clearInterval(picInterval);
        
                $("#server").show();
                $("#img").hide();
                $("#test").hide();
                getVideoFiles();
        });
        $('#control').click()

        $("#JSON").on('click', () => getJSON());
        $("#db").on('click', () => getDB());
        $("#files").on('click', () => getFiles());
        $("#model").on('click', () => getModel());

        $("#clear-db").on('click', function () {
                if (confirmation()){
                        clearDB()
                }
        });
        $("#clear-data").on('click', function () {
                if (confirmation()){
                        clearData()
                }
        });
        $("#clear-img").on('click', function () {
                if (confirmation()){
                        clearImages()
                }
        });
        $("#clear-pairs").on('click', function () {
                if (confirmation()){
                        clearPairs()
                }
        });
        $("#clear-model").on('click', function () {
                if (confirmation()){
                        clearModel()
                }
        });
        $("#split").on('click', function () {
                createImages()
        });
        $("#pairs").on('click', function () {
                createPairs()
        });
        $("#video").on('click', function () {
                uploadVideo()
        });
});
