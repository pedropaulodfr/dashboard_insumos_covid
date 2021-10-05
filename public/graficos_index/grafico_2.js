am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    var chart = am4core.create("grafico_2", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.fontFamily = "Segoe UI";
    
    chart.data = dadosGraficoMedicamentoGeral;
    
    // title
    let title = chart.titles.create();
    title.text = "Quantidade total de medicamentos distribuídos aos estados";
    title.fontWeight = "bold";
    title.fontFamily = "Segoe UI"
    title.align = "center";
    
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "item";
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 14;
    categoryAxis.renderer.labels.template.dy = 0;
    categoryAxis.renderer.labels.template.rotation = -100;
    
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.baseGrid.disabled = true;
    
    
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "item";
    series.dataFields.valueY = "quantidade";
    series.columns.template.tooltipText = "{valueY.value}";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;
    
    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
    
    }); // end am4core.ready()
    