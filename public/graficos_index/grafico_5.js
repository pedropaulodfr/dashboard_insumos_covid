am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    /**
     * Chart design taken from Samsung health app
     */
    
    var chart = am4core.create("grafico_5", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    
    chart.paddingBottom = 30;
    
    // title
    let title = chart.titles.create();
    title.text = "Quantidade total de respiradores distribuídos a outros países";
    title.fontWeight = "bold";
    title.fontFamily = "Segoe UI"
    title.align = "center";
    
    // Add data
    chart.data = dadosGraficoRespiradorPaises;
    
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "pais";
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.dy = 35;
    categoryAxis.renderer.tooltip.dy = 35;
    
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.3;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.baseGrid.strokeOpacity = 0;
    valueAxis.title.text = "Quantidade";
    valueAxis.title.fontWeight = "bold";
    
    var series = chart.series.push(new am4charts.ColumnSeries);
    series.dataFields.valueY = "quantidade";
    series.dataFields.categoryX = "pais";
    series.tooltipText = "{valueY.value}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.dy = - 6;
    series.columnsContainer.zIndex = 100;
    
    var columnTemplate = series.columns.template;
    columnTemplate.width = am4core.percent(50);
    columnTemplate.maxWidth = 66;
    columnTemplate.column.cornerRadius(60, 60, 10, 10);
    columnTemplate.strokeOpacity = 0;
    
    series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueY", min: am4core.color("#ADD8E6"), max: am4core.color("#1E90FF") });
    series.mainContainer.mask = undefined;
    
    var cursor = new am4charts.XYCursor();
    chart.cursor = cursor;
    cursor.lineX.disabled = true;
    cursor.lineY.disabled = true;
    cursor.behavior = "none";
    
    var bullet = columnTemplate.createChild(am4charts.CircleBullet);
    bullet.circle.radius = 30;
    bullet.valign = "bottom";
    bullet.align = "center";
    bullet.isMeasured = true;
    bullet.mouseEnabled = false;
    bullet.verticalCenter = "bottom";
    bullet.interactionsEnabled = false;
    
    var hoverState = bullet.states.create("hover");
    var outlineCircle = bullet.createChild(am4core.Circle);
    outlineCircle.adapter.add("radius", function (radius, target) {
        var circleBullet = target.parent;
        return circleBullet.circle.pixelRadius + 10;
    })
    
    var image = bullet.createChild(am4core.Image);
    image.width = 60;
    image.height = 60;
    image.horizontalCenter = "middle";
    image.verticalCenter = "middle";
    image.propertyFields.href = "href";
    
    image.adapter.add("mask", function (mask, target) {
        var circleBullet = target.parent;
        return circleBullet.circle;
    })
    
    var previousBullet;
    chart.cursor.events.on("cursorpositionchanged", function (event) {
        var dataItem = series.tooltipDataItem;
    
        if (dataItem.column) {
            var bullet = dataItem.column.children.getIndex(1);
    
            if (previousBullet && previousBullet != bullet) {
                previousBullet.isHover = false;
            }
    
            if (previousBullet != bullet) {
    
                var hs = bullet.states.getKey("hover");
                hs.properties.dy = -bullet.parent.pixelHeight + 30;
                bullet.isHover = true;
    
                previousBullet = bullet;
            }
        }
    })
    
    }); // end am4core.ready()