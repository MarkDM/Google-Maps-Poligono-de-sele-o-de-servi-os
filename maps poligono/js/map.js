// Váriáveis necessárias
var map;
var marker;
var pointsArray = [];
var markersArray = [];
var polsArray = [];
var infowindowArray = [];
var pol = false;
var serSelecionadosArray = [];
// var modServico = false;
var polygon;

//Objetos json
var servicos = [];

//Objetos marker
var servicosMarker = [];

var serNoPoligono = [];
var i = 0;
var numeroLados = 4;



function initialize() {

   var mapOptions = {
      center: new google.maps.LatLng(-16.712494,-49.278831),
      zoom: 13,
      mapTypeId: 'roadmap',
      draggable: true
   };

   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


   carregaServicos();

   // Evento que detecta o click no mapa para criar o marcador
   google.maps.event.addListener(map, "click", function(event) {


    //Se já existir um poligono vai embora
    if (pol) {
      limparInfoWindow()
      return;
    }


      // O evento "click" retorna a posição do click no mapa,
      // através dos métodos latLng.lat() e latLng.lng().

      // Passamos as respectivas coordenadas para as variáveis lat e lng
      // para posterior referência.
      // Utilizamos o método toFixed(6) para limitar o número de casas decimais.
      // A API ignora os valores além da 6ª casa decimal
      var lat = event.latLng.lat().toFixed(6);
      var lng = event.latLng.lng().toFixed(6);

      // A criação do marcador é feita na função createMarker() e
      // passamos os valores das coordenadas do click através
      // dos parâmetros lat e lng.
      createMarker(lat, lng);

      // getCoords() actualiza os valores de Latitue e Longitude
      // das caixas de texto existentes no topo da página
      getCoords(lat, lng);

   });


}


google.maps.event.addDomListener(window, 'load', initialize);

// Função que cria o marcador
function createMarker(lat, lng) {

   // definir a variável marker com os novos valores
   marker = new google.maps.Marker({

      // Define a posição do marcador através dos valores lat e lng
      // que foram definidos através do click no mapa
      position: new google.maps.LatLng(lat, lng),
      //label: String(markersArray.length + 1),
      draggable: true,
      icon: 'local.png',
      map: map
   });

   //Coloca os marcadores num array para que possam ser manipulados posteriormente
   markersArray.push(marker);

   //Coloca os pontos marcados num array para que possam ser usados para criar o poligono
   pointsArray.push(marker.getPosition());
  
   // Evento que detecta o arrastar do marcador


   google.maps.event.addListener(marker, 'drag', function() {
      
      // Actualiza as coordenadas de posição do marcador no mapa
       //marker.position = this.getPosition();

      // Redefine as variáveis lat e lng para actualizar
      // os valores das caixas de texto no topo
      //var lat = marker.position.lat().toFixed(6);
     // var lng = marker.position.lng().toFixed(6);

      // Chamada da função que actualiza os valores das caixas de texto
      //getCoords(lat, lng);

      if (pol) {

      pointsArray = [];

      //Atualiza no array a posição do marcador que está sendo arrastado
      for (var i = 0; i < markersArray.length; i++) {
            if (markersArray[i] === this) {

                markersArray[i].position = this.position;
            }

            //atualiza no array as coordenadas do marcardor que está sendo arrastado
            pointsArray.push(markersArray[i].position);

      }

      criaPoligono(pointsArray);


      }
   
      

   });

    //Quando atingir o numero de lados
   if (markersArray.length == numeroLados) {

      //Caso não exista um poligono na tela
      if (!pol) {
      
         criaPoligono(pointsArray);         
      }      
      
         return;
         
     }


}

function createService(lat, lng){


   service = new google.maps.Marker({

      position: new google.maps.LatLng(lat, lng),
      label: String(servicosMarker.length + 1),
      draggable: false,
      icon: 'service.png',
      map: map
   });

   //joga os pontos de servicos num array
   servicosMarker.push(service);




//Desaloca um serviço
google.maps.event.addListener(service,'dblclick',function(){

        //posição do marcador que disparou o evento  
         var posSM = servicosMarker.indexOf(this);
         
         //traz a posição do serSelecionadosArray que contém o serviço que foi alocado no evento de alocação
         //os arrays 'servicos' e 'servicosMarker' sempre tem o mesmo tamanho visto que os markers são criados a partir do json
         var posSS = serSelecionadosArray.indexOf(servicos[posSM]);

         if (!(posSS == -1)) {
            serSelecionadosArray.splice(posSS, 1); //retira o serviço do array
            servicosMarker[posSM].setIcon('service.png'); //troca o icone
            
         }
        

        mostrarSelecionados();
  });



//Aloca um serviço
google.maps.event.addDomListener(service,'click',function(){

     //posição do marcador que disparou o evento    
     var posSM = servicosMarker.indexOf(this);
    
     //teste para ver se o serviço ja foi alocado sendo selecionado ou dentro do poligono
     var posSS = serSelecionadosArray.indexOf(servicos[posSM]);
     var posPol = serNoPoligono.indexOf(servicos[posSM]);

         if ((posSS == -1) && (posPol == -1)) {
            serSelecionadosArray.push(servicos[posSM]);
            servicosMarker[posSM].setIcon('service_.png');
            
         }
        

        mostrarSelecionados();

  });


//Mostra a info window
  google.maps.event.addListener(service,'rightclick',function(){

      var contentString;
      

      for (var i = 0; i < servicosMarker.length; i++) {

        if (servicosMarker[i] === this) {

            var t = servicos[i];
            
            //servicosMarker[i].setIcon()

             contentString = '<b>Id:</b> ' + t.id + '<br>' +
                 '<b>Descrição:</b> ' + t.nome + '<br>' +
                 '<b>Posição:</b> ' + t.lat + '/' + t.lng + '<br><br>'
                 /*+
                 '<button id="alocar" onclick="serSelecAlocar()">Alocar</button>' +
                 '<button id="desalocar" onclick="serSelecDesalocar()">Desalocar</button>'*/
                  ;
                 break;

        }

      }

         limparInfoWindow();

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        infowindowArray.push(infowindow);

        infowindow.open(map, this);

  });


}

// Função que actualiza as caixas de texto no topo da página
function getCoords(lat, lng) {

   // Referência ao elemento HTML (input) com o id 'lat'
   var coords_lat = document.getElementById('lat');

   // Actualiza o valor do input 'lat'
   coords_lat.value = lat;

   // Referência ao elemento HTML (input) com o id 'lng'
   var coords_lng = document.getElementById('lng');

   // Actualiza o valor do input 'lng'
   coords_lng.value = lng;
}



function criaPoligono(cords) {

   limparPoligono();

   polygon = new google.maps.Polygon({
        // Coordenadas do seu objeto
        paths: cords,
        draggable: true,
        // Cor do da linha
        strokeColor: '#005eff',

        // Opacidade da linha
        strokeOpacity: 0.3,

        // Espessura da linha
        strokeWeight: 2,

        // Cor de preenchimento do objeto
        fillColor: '#0092ff',

        // Opacidade do preenchimento
        fillOpacity: 0.35
      });

   polygon.setMap(map);
   pol = true;

    servicosNoPoligono();
    polMudaIconeServicos();

   //Coloca o poligono criado num array
   polsArray.push(polygon);

    var counter = 0;
  


    //Ao arrastar poligono
     google.maps.event.addListener(polygon,'drag',function(){


        servicosNoPoligono();

     });


      google.maps.event.addListener(polygon,'dragstart',function(){

        for (var i = 0; i < markersArray.length; i++) {
          markersArray[i].setMap(null);
        }
        markersArray = [];
        
      });

      google.maps.event.addListener(polygon,'dragend',function(){

          pointsArray = []
          for (var i = 0; i < numeroLados; i++) {
           var lat = this.latLngs.b[0].b[i].lat();
           var lng = this.latLngs.b[0].b[i].lng();
          createMarker(lat,lng);


         servicosNoPoligono();

       }

         polMudaIconeServicos();

      });

}


//Limpa os objetos da tela e zera os arrays
function limparMarkers() {
   
   for (i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
   }

   markersArray = [];
   pointsArray = [];


   limparPoligono();

}

function limparServicos() {

  for (i = 0; i < servicos.length; i++) {
      servicosMarker[i].setMap(null);
   }

   servicosMarker = [];
   
      var a = document.getElementById("serNoPoligono");
       a.innerHTML = "";

}

function modServicos(){

  if (modServico) {

    modServico = false;
    document.getElementById("info").innerHTML = "";
  }else {
    modServico = true;
    document.getElementById("info").innerHTML = "Modo de Serviço";
  }
 
  
}

function limparPoligono() {

    pol = false;

   for (i = 0; i < polsArray.length; i++) {
      polsArray[i].setMap(null);
   }

   polsArray = [];

}

function limparInfoWindow() {
  
  if (!(infowindowArray.length == 0)) {
    for (var i = 0; i < infowindowArray.length; i++) {
    infowindowArray[i].close();
   }
  }

  
}

//Mostra os serviços de forma personalizada
function servicosNoPoligono() {

    serNoPoligono = [];
    var a = document.getElementById("serNoPoligono");
    a.innerHTML = "";
    var temp = [];

       for ( i = 0;i < servicosMarker.length;i++) {


            if (google.maps.geometry.poly.containsLocation(servicosMarker[i].position, polygon)) {

            //Testa se o serviço ja não está no array de de serviços selecionados
            var posSS = serSelecionadosArray.indexOf(servicos[i]);

            if (posSS == - 1) {
              serNoPoligono.push(servicos[i]);
            }
                     
            

          }
      }


      if (!(serNoPoligono.length == 0)) {


      for (var i = 0; i < serNoPoligono.length; i++) {
        t = serNoPoligono[i]
        temp.push((t.id + '-' + t.nome + '<br>'));
      }
          
            a.innerHTML = temp;         

      }

      
}


//Mostra os serviços de forma personalizada
function mostrarSelecionados() {
    
  var a = document.getElementById("serSelecionado");
  var temp = [];
  var t;
  a.innerHTML = "";
  

  for (var i = 0; i < serSelecionadosArray.length; i++) {
    t = serSelecionadosArray[i]
    temp.push((t.id + '-' + t.nome + '<br>'));
  }

  a.innerHTML = temp;

}


function carregaServicos() {

      //Gera os serviços a partir do json
      var url = './data.json';

     $.getJSON(url, function(json) {



      for (var i = 0; i < json.length; i++) {

        servicos[i] = json[i];

        createService(servicos[i].lat,servicos[i].lng);
        
      }



     });
}

//Muda os icones dos servicos que estiverem dentro do poligono
function polMudaIconeServicos() {

       for (var i = 0; i < servicosMarker.length; i++) {

            if (serNoPoligono.indexOf(servicos[i]) != -1) {
              servicosMarker[i].setIcon('service_.png');
            }
            else{

              //Testa se o serviço está no array de serviços selecionados
              if (serSelecionadosArray.indexOf(servicos[i]) == -1) {
                servicosMarker[i].setIcon('service.png');
              }
              
            }
           
          }
}



