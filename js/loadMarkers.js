//Load markers.json from URL
var geoJsonName = GetURLParameter("school");
function GetURLParameter(urlParamName){
    try {
        var urlSubstring = window.location.search.substring(1);
        var urlVars = urlSubstring.split('&');

        for (var i = 0; i < urlVars.length; i++) 
        {
            var currentParam = urlVars[i].split('=');
            if (currentParam[0] == urlParamName) 
            {
                return urlParamName[1];
            }
        }
    } catch (error) {
        console.error(error);
        console.log("Parameter not defined or not found");
    }
}
var myGeoJsonVar = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-99.0907059,19.466031]
            },
            "properties": {
                "markerType": "GeneralLocation",
                "name": "CECyT 1 - Gonzalo Vázquez Vela",
                "toolTip": "CECyT 1 - Gonzalo Vázquez Vela"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-99.0906259,19.466531]
            },
            "properties": {
                "markerType": "Hazard",
                "name": "Subestación Eléctrica N° 1",
                "toolTip": "Subestación Eléctrica N° 1",
                "info": [
                    {"CONDICIONES": ["Subestación ubicada en área extereior la cual se encuentra con restrición de personal.", "Falta de tapas en tablero de distribución dejando expuestos circuitos.", "Falta señalética.", "No cuenta con dique para derrames del transformador.", "No cuenta con equipo de protección personal."]},
                    {"NOM": ["NOM-001-SEDE-2012, instalaciones eléctricas (utilización).", "NOM-029-STPS-2011, Mantenimiento de las instalaciones eléctricas en los centros de trabajo-condiciones de seguridad.", "NOM-022-STPS-2015, Electricidad estática en los centros de trabajo-condiciones de seguridad.", "NOM-133-SEMARNAT-2015, protección a mbienta I-Bifeni los Policlorados. Especificaciones de manejo.", "NOM-018-STPS-2000, Sistema para la identificación y comunicación de peligros y riesgos por sustancias químicas peligrosas en los centros de trabajo.", "NOM-026-STPS-2008, Colores y señales de seguridad e higiene, e identificación de riesgos por fluidos conducidos en tuberías."]},
                    {"RECOMENDACIONES": ["Colocar todos sus aditamentos de seguridad para proteger los circuitos principales y evitar accidentes.", "Realizar prueba de Bifenilos Policlorados al aceite de los trasformadores para saber si está en buen estado y no es un contaminante dañino al medio ambiente y a la salud.", "Colocar señalética de Peligro Riesgo Eléctrico, Solo Personal autorizado, No Operar Solo Personal Autorizado, Identificar los interruptores por zona, aplicar 5 s.", "Colocar careta facial, guantes para alta tensión, tarimas o tapetes dieléctricos y pértiga."]},
                    {"RIESGO": ["Personal no capacitado o alumnos pueden sufrir choques eléctricos al ingresar a áreas restringidas", "Contaminación al medio ambiente y a personal que se exponga a posibles derrames de trasformador obsoleto.", "Caídas o resbalones sobre circuitos eléctricos y atrapamientos con trasformador obsoleto."]},
                    {"EVIDENCIA": ["FOTO SUBESTACIÓN CECYT NO. 1.png", "FOTO SUBESTACIÓN CECYT NO. 1.png", "FOTO SUBESTACIÓN CECYT NO. 1.png", "FOTO SUBESTACIÓN CECYT NO. 1.png"]}
                ]
            }
        }
    ]
};

//Setup map
var hazardIcon = L.icon(
    {
        iconUrl: './img/hazardIcon.png',
        iconSize: [20, 20],
        iconAnchor: [0,20],
        popupAnchor: [10,-20]
    }
);

mapInit();

function mapInit(/*geoJsonVar*/){


var mymap = L.map('interactiveMap').setView([19.466531,-99.0906259], 18);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom: 19.9, minZoom: 15}).addTo(mymap);

L.geoJSON(myGeoJsonVar, {
    onEachFeature: onEachFeature
}).addTo(mymap);
}

function onEachFeature(feature, currentNewMarker) {
    currentNewMarker.bindTooltip(feature.properties.toolTip);
    currentNewMarker.options.title = feature.properties.name;
    if(feature.properties.markerType == "Hazard"){
        currentNewMarker.setIcon(hazardIcon);
    }
    if (feature.properties.info) {
        currentNewMarker.on('click', onClick);
    }
    if(!feature.properties.info){
        document.getElementById("subBanner").innerHTML=feature.properties.name;
    }
}

function onClick(e) {
    loadInfo(this);
}

function loadInfo(marker){
    for (var featureKey of Object.keys(myGeoJsonVar.features)){
        if (myGeoJsonVar.features[featureKey].properties.info) {
            document.getElementById("subBanner").innerHTML = myGeoJsonVar.features[featureKey].properties.name;
            for(var infoKey of Object.keys(myGeoJsonVar.features[featureKey].properties.info)){
                loadToList(myGeoJsonVar.features[featureKey].properties.info[infoKey]);
            }
        }
    }
}

function loadToList(itemsObject){
    for(var infoSectionKey of Object.keys(itemsObject)){
        if(infoSectionKey != "EVIDENCIA"){
            myList = document.getElementById(infoSectionKey);
            myList.innerHTML="";
            for(var newItem in itemsObject[infoSectionKey]){
                var item = document.createElement("li");
                item.innerText = itemsObject[infoSectionKey][newItem];
                myList.appendChild(item);
            }
        }
    }
}