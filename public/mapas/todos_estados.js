
google.load('visualization', '1', {
  'packages': ['geochart', 'table']
  }
);

google.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
  // Siglas dos estados do Brasil
  var estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB",
      "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SE", "SP", "TO"];

  var dados =[['State', '']];

  // Adicionando siglas à Array dados no formato [BR-**], onde ** representa a sigla do estado
  estados.forEach(function (item, indice, array) {
    dados.push(['BR-' + item, 100]);
  })

  // Deixando todos os dados de uma única cor
  var data = google.visualization.arrayToDataTable(dados);
  data.addColumn({type: 'string', role: 'tooltip', p:{html:true}}, 'ToolTip');

  var chart = new google.visualization.GeoChart(
  document.getElementById('chart_div'));
  chart.draw(data, options);

  // Mostrando apenas a sigla do estado na dica de ferramenta (tooltip)
  var formatter = new google.visualization.PatternFormat('{0}');
  formatter.format(data, [0,0], 1 );
  var formatter = new google.visualization.PatternFormat('{2}');
  formatter.format(data, [0,1,2], 1 );

  var geochart = new google.visualization.GeoChart(
  document.getElementById('chart_div'));
  var options = {
    region: 'BR',
    resolution: 'provinces',
    width: 950,
    height: 590,
    backgroundColor: 'transparent',
    datalessRegionColor: 'transparent',
    legend: 'none',
    tooltip: {
      textStyle: {color: '#0fa3da'}, showColorCode: true,
      trigger: 'focus'
    }
  };

  chart.draw(data, options);

  google.visualization.events.addListener(geochart, 'regionClick', function (eventData) {
    // maybe you want to change the data table here...
    options['region'] = eventData.region;
    options['resolution'] = 'provinces';
    options['displayMode'] = 'markers';

    //window.location.href = "/estado" ;
    // Ação quando o estado for clicado
    document.getElementById('sigla').value = String(eventData.region);
    document.getElementById('sigla-estado-materiais').value = String(eventData.region);
    document.getElementById('sigla-estado-respiradores').value = String(eventData.region);

    //Verificando radio buttons
    var radios = document.getElementsByName("check-bases");
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        console.log("Escolheu: " + radios[i].value);
        var dadoEscolhido = radios[i].value;
      };
    };
    
    switch (dadoEscolhido) {
      case "Materiais":
        document.getElementById('submit-materiais').click();
        break;
      case "Medicamentos":
        document.getElementById('submit-medicamentos').click();
        break;
      case "Respiradores":
        document.getElementById('submit-respiradores').click();
        break;
      default:
        break;
    };

    //document.getElementById('submit').click();
    console.log(eventData.region);
      
    //geochart.draw(data, options);
    //var table = new google.visualization.Table(document.getElementById('table'));
    //table.draw(data, null);
  });
  
  geochart.draw(data, options);
  document.getElementById("map-load").style.display = 'none';
};