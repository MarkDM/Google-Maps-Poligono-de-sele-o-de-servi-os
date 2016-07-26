<!DOCTYPE html>
<html>
  	<head>
  		<meta charset="utf-8">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	   <link rel="stylesheet" type="text/css" href="css/style.css">
	   <script type="text/javascript" src="http://maps.google.com/maps/api/js?libraries=geometry&key=AIzaSyCd9hF6HM_0j8tIrN3UHZXDylrTWsr2hac"></script>



	   <script type="text/javascript" src="js/map.js"></script>

	</head>
	<body>
   	<div class="coordenadas">
    		<span>Coordenadas Google Maps</span>
    		<label for="lat">Lat:</label>
    		<input type="text" name="lat" id="lat" value="0" />
    		<label for="lng">Lng:</label> -->
    		<input type="text" name="lng" id="lng" value="0" />

        <button id="clear" onclick="limparMarkers()">Limpar</button>
        <button id="clear" onclick="limparServicos()">Limpar serviços</button>
        <!-- <button id="ser" onclick="modServicos()">Mod Servico</button> -->
        <span id="info"></span>
    	</div>
    	<div id="map-canvas"></div>

      <div id="gContainer">

      <div id="snpContainer">
          
           Serviços dentro do Poligono: <div id="serNoPoligono"></div>

      </div>
      <div id="ssContainer">
          
           Serviços Selecionados: <div id="serSelecionado"></div>

      </div>

      </div>
     
  	</body>
</html>