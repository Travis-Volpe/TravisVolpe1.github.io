        require([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/widgets/LayerList",
            "esri/widgets/Legend",
            "esri/widgets/Expand",
            "esri/widgets/BasemapGallery",
            "esri/widgets/Search",
            "esri/widgets/Locate",
            "esri/core/lang",
            "dojo/on",
            "dojo/domReady!"
        ],
        function (
            Map, MapView, FeatureLayer, LayerList, Legend, Expand, BasemapGallery, Search, Locate
        ) {

        var resRenderer = {
            type: "simple",
            symbol: { type: "simple-fill"},
            visualVariables: [{
                type: "color",
                field: "Join_Count",
                label: "Tree Count",
                stops: [{ value: 1, color: "#00a103" },
                    {value: 707, color:"#004211"}]
            }]
        };

        var resLayer = new FeatureLayer({
            title: "Casey Trees Residential & Private Tree Plantings per Neighborhood",
            url: "https://services2.arcgis.com/j23KFYd23hRWewtZ/arcgis/rest/services/dc_neighborhood_cttrees_join6/FeatureServer/0",
            renderer: resRenderer,
            outFields: ["Join_Count", "State", "County", "City", "Name", "RegionID"],
            popupTemplate: {
                title: "Neighborhood: {Name}",
                content: [{
                    type: "fields",
                    fieldInfos: [{
                        fieldName: "Join_Count",
                        label: "Tree Count",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    }]
                }]
            },
            definitionExpression: "Join_Count > 0",
        });

        var heatmapRenderer = {
            type: "heatmap",
            blurRadius: 10,
            opacity: 0,
            colorStops: [
                {ratio: 0, color: "rgba(63, 40, 102, 0)"},
                {ratio: .1, color: "#b9f3a5"},
                {ratio: .3, color: "#8eef71"},
                {ratio: .5, color: "#5ddd4a"},
                {ratio: .7, color: "#2aca15"},
                {ratio: 1, color: "#0c8500"}
            ],
            minPixelIntensity: 0,
            maxPixelIntensity: 1000
        };

        var simpleRenderer = {
            type: "simple",
            symbol: {
                type: "simple-marker",
                size: 6,
                color: "#008201",
            }
        };
        var ctTemplate = {
            title: "Casey Trees Tree Plantings",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "CmmnName",
                    label: "Common Name",
                    visible: true,
                }, {
                    fieldName: "SciName",
                    label: "Scientific Name",
                    visible: true,
                }, {
                    fieldName: "EventName",
                    label: "Event",
                    visible: true,
                }, {
                    fieldName: "EventDate",
                    label: "Date",
                    visible: true,
                },{
                    fieldName: "Year",
                    label: "Year",
                    visible: true,
                }]
            }]
        };


        var cttreesLayer = new FeatureLayer({
            title: "CT Non-Res Trees",
            url: "https://services2.arcgis.com/j23KFYd23hRWewtZ/arcgis/rest/services/dc_metro_trees/FeatureServer/0",
            popupTemplate: ctTemplate,
            <!--opacity: 0.75-->
        });

        var map = new Map({
            basemap: "gray"
        });

        var view = new MapView({
            map: map,
            container: "viewDiv",
            extent: {
                xmin: -8584944,
                ymin: 4693229,
                xmax: -8561500,
                ymax: 4721036,
                spatialReference: 102100
            }
        });

        view.when(function () {
            var layerList = new LayerList({
                view: view
            });
            view.ui.add(layerList, "top-right");
        });

        var legend = new Legend({
            view: view
        });

        var basemapGallery = new BasemapGallery({
            view: view,
            container: document.createElement("div")
        });

        var bgExpand = new Expand({
            view: view,
            content: basemapGallery
        });

        var locateBtn = new Locate({
            view: view
        });

        var search = new Search({
            view: view
        });

        view.scale = 125000;

        view.ui.add([
            {
                component: legend,
                position: "bottom-left",
            },{
                component: bgExpand,
                position: "top-left",
            }, {
                component: locateBtn,
                position: "top-left",
            }, {
                component: search,
                position: "bottom-right"
            }
        ]);

        view.watch("scale", checkScale);

        function checkScale(){
            if(view.scale <40000){
                cttreesLayer.renderer = simpleRenderer;
            }else{
                cttreesLayer.renderer = heatmapRenderer;
            }
        };

        map.add(resLayer);
        map.add(cttreesLayer);
    });