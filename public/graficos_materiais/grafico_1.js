am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end
  
  var chart = am4core.create("grafico_1", am4charts.XYChart);
  chart.fontFamily = "Segoe UI";
  
  chart.data = dadosGraficoMaterial;
  
  chart.padding(40, 40, 40, 40);
  
  var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.dataFields.category = "material";
  categoryAxis.renderer.minGridDistance = 60;
  categoryAxis.renderer.inversed = true;
  categoryAxis.renderer.grid.template.disabled = true;
  categoryAxis.renderer.labels.template.rotation = -100;
  
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;
  valueAxis.extraMax = 0.1;
  //valueAxis.rangeChangeEasing = am4core.ease.linear;
  //valueAxis.rangeChangeDuration = 1500;
  
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.categoryX = "material";
  series.dataFields.valueY = "quantidade";
  series.tooltipText = "{valueY.value}"
  series.columns.template.strokeOpacity = 0;
  series.columns.template.column.cornerRadiusTopRight = 10;
  series.columns.template.column.cornerRadiusTopLeft = 10;
  //series.interpolationDuration = 1500;
  //series.interpolationEasing = am4core.ease.linear;
  var labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.verticalCenter = "bottom";
  labelBullet.label.dy = -10;
  labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
  
  chart.zoomOutButton.disabled = true;
  
  // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
  series.columns.template.adapter.add("fill", function (fill, target) {
   return chart.colors.getIndex(target.dataItem.index);
  });
  
  setInterval(function () {
   am4core.array.each(chart.data, function (item) {
     item.visits += Math.round(Math.random() * 200 - 100);
     item.visits = Math.abs(item.visits);
   })
   chart.invalidateRawData();
  }, 2000)
  
  categoryAxis.sortBySeries = series;
  
  }); // end am4core.ready()