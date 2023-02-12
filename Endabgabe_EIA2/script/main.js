var Endabgabe_EIA2;
(function (Endabgabe_EIA2) {
    //Onload Listener -> Handle Load
    window.addEventListener("load", handleLoad);
    //Globale Variablen
    Endabgabe_EIA2.size = 0;
    //Deklarationen von verschiedenen Buttons, Canvas + Server Variablen, Eventlister etc.
    async function handleLoad() {
        let canvas = document.querySelector("canvas");
        if (!canvas)
            return;
        Endabgabe_EIA2.crc2 = canvas.getContext("2d");
        let button = document.querySelector("button[id=but1]");
        //holt daten vom Server und gibt sie an den Funktionaufruf loadData weiter
        let response = await fetch("https://webuser.hs-furtwangen.de/~aberleba/Database/index.php/?command=find&collection=data");
        let entry = await response.text();
        let data = JSON.parse(entry);
        button.addEventListener("click", sendData);
        document.querySelector("canvas").addEventListener("click", getInput);
        loadData(data);
        drawBackground();
    }
    Endabgabe_EIA2.handleLoad = handleLoad;
    //Funktion speichert timecode, color und die Endgröße des Feuerwerks in Variablen ab und gibt sie in einem Interval 
    //an generateRocket weiter
    function getInput(_event) {
        let formData = new FormData(document.forms[0]);
        let timecode = Number(formData.get("Speed").toString());
        let color = formData.get("Picker").toString();
        let endSize = Number(formData.get("Size"));
        let x = _event.x - 58;
        let y = _event.y - 75;
        let interval = setInterval(function () { generateRocket(x, y, endSize, color, interval); }, timecode);
    }
    //Funktion erzeugt Objekte der vector und firework Klasse und führt deren Methoden aus
    function generateRocket(_x, _y, _endSize, _color, _interval) {
        //wenn die gezeichnete Größe < als die festgelegte End Größe 
        if (Endabgabe_EIA2.size < _endSize) {
            let vector = new Endabgabe_EIA2.Vector(_x, _y);
            let firework = new Endabgabe_EIA2.Firework(vector, _endSize, _color);
            firework.update();
            firework.draw();
            //wenn die gezeichnete Größe >= der festgelegten Endgröße ist
        }
        else {
            //ende Interval & gezeichnete Größen Variable wird auf 0 zurückgesetzt
            clearInterval(_interval);
            Endabgabe_EIA2.size = 0;
            drawBackground();
        }
    }
    //Zeichnet den Hintergrund des Canvas in einem Gradienten
    function drawBackground() {
        let golden = 0.62;
        let gradient = Endabgabe_EIA2.crc2.createLinearGradient(0, 0, 0, Endabgabe_EIA2.crc2.canvas.height);
        gradient.addColorStop(0, "#00000d");
        gradient.addColorStop(golden, "#00001a");
        gradient.addColorStop(1, "#000026");
        Endabgabe_EIA2.crc2.fillStyle = gradient;
        Endabgabe_EIA2.crc2.fillRect(0, 0, Endabgabe_EIA2.crc2.canvas.width, Endabgabe_EIA2.crc2.canvas.height);
    }
    Endabgabe_EIA2.drawBackground = drawBackground;
    // sendet die Daten aller Form Elemente an den Server
    async function sendData() {
        //Soll Seite neu laden da es sonst zu Problemen mit der Server Kommunikation kommen kann, wenn gleich ein neuer Eintrag
        //gespeichert wird
        window.open("./silvester.html", "_self");
        let formData = new FormData(document.forms[0]);
        let json = {};
        //Umwandlung FormData in Json FormData
        for (let key of formData.keys())
            if (!json[key]) {
                let values = formData.getAll(key);
                json[key] = values.length > 1 ? values : values[0];
            }
        let query = new URLSearchParams();
        let newJSON = JSON.stringify(json);
        query.set("command", "insert");
        query.set("collection", "data");
        query.set("data", newJSON);
        await fetch("https://webuser.hs-furtwangen.de/~aberleba/Database/index.php?" + query.toString());
    }
    // lädt daten aus dem Server und speichert sie in Variablen ab , Funktionsaufruf loadEntry mit Übergabeparametern der Daten
    function loadData(_data) {
        //Der Liste werden die einzelnen Einträge der Daten vom Server hinzugefügt
        let list = [];
        for (let num in _data.data) {
            list.push(num);
        }
        //jeweils für jeden Eintrag der Liste werden Variablen deklariert und werden an loadEntry weitergegeben
        for (let index of list) {
            let name = _data.data[index].Name;
            let size = _data.data[index].Size;
            let picker = _data.data[index].Picker;
            let speed = _data.data[index].Speed;
            loadEntry(name, size, picker, speed, index);
        }
    }
    // Lädt die gespeicherten Einträge unten auf der Seite in dem neue Div Elemente erzeugt werden
    function loadEntry(_name, _density, _picker, _speed, _index) {
        let newDiv = document.createElement("div");
        let parent = document.querySelector("#savedRockets");
        newDiv.innerHTML = _name;
        newDiv.id = "entry";
        //Event Listener für jedes geklickte Element werden erzeugt und rufen editItem und deleteItem auf, newDiv wird auch als 
        //Parameter mitgegeben, damit die jeweilige Funktion das richtige Div Element löscht oder editiert
        newDiv.addEventListener("click", function () {
            editItem(newDiv, _name, _density, _picker, _speed);
            deleteItem(newDiv, _index);
        });
        parent.appendChild(newDiv);
    }
    // Fügt die Values von den gespeicherten Einträgen vom Server in die Input Felder 
    function editItem(newDiv, _name, _density, _picker, _speed) {
        let name = document.querySelector("input#name");
        name.value = _name;
        let density = document.querySelector("#slider1");
        density.value = _density.toString();
        let picker = document.querySelector("#input2");
        picker.value = _picker;
        let speed = document.querySelector("#slider2");
        speed.value = _speed;
    }
    //Löscht den Eintrag aus dem Server raus und löscht die zugehörige Div vom Screen
    async function deleteItem(_newDiv, _index) {
        _newDiv.parentElement.removeChild(_newDiv);
        let query = new URLSearchParams();
        query.set("command", "delete");
        query.set("collection", "data");
        query.set("id", _index.toString());
        await fetch("https://webuser.hs-furtwangen.de/~aberleba/Database/index.php?" + query.toString());
        console.log("deletet");
    }
})(Endabgabe_EIA2 || (Endabgabe_EIA2 = {}));
//# sourceMappingURL=main.js.map