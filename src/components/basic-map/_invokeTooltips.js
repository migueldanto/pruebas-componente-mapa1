
/**
 * Invocar el mostrar/ocultar los tooltips dentro del mapa
 * @param {Map} map objeto mapa de Open Layers
 * @param {*} e evento
 */
 export const invoke_tooltips = (map, e) => {
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);

    let capas_con_tooltip = map.getLayers().getArray().filter(item=>item.get("_tooltip")!=undefined).map(item2=>item2.get("id"))
    
    let tooltip_overlay_nomov = map.getOverlayById("tooltip");
    let tooltip_overlay_mov = map.getOverlayById("tooltipmov");
    //let tooltipelement = document.getElementById("fixed-tooltip-content");
    if (hit) {
        var f_l = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            return [feature, layer];
        });
        map.getTargetElement().style.cursor = 'pointer';
        if (f_l) {
            var layer = f_l[1];
            var feature = f_l[0];
            if(map.hover_feature == feature && !layer.get("_tooltip_mov") ){
                return 
            }
            if (capas_con_tooltip.includes(layer.get("id")) &&  layer.get("_tooltip")!=undefined ) {
                //hightlight_on_hover(f_l[0]);
                //if (layers[layer.get("name")].highlight_accessor != undefined) {
                //    layers[layer.get("name")].highlight_accessor(f_l[0])
                //}

                let contenido = layer.get("_tooltip")
                if(typeof contenido == "function"){
                    contenido = contenido(feature.getProperties())
                }
                let tooltip_overlay = layer.get("_tooltip_mov") ? tooltip_overlay_mov : tooltip_overlay_nomov
                if(layer.get("_tooltip_mov")){
                    tooltip_overlay_nomov.setPosition(undefined)
                }else{
                    tooltip_overlay_mov.setPosition(undefined)
                }

                //console.log(contenido,"es lo que acaba de pasar, este es el contenido a mandar en el tooltip")

                let ext = map.getView().calculateExtent();
                let x3 = (ext[0] + ext[2]) / 2;
                let y3 = (ext[1] + ext[3]) / 2;
                if(feature.getGeometry().getType()=="Point"){
                    tooltip_overlay.setPosition(feature.getGeometry().getCoordinates())
                }else{
                    tooltip_overlay.setPosition([e.coordinate[0], e.coordinate[1]])
                }
                        //console.log(x3,e.coordinate[0])
                if(layer.get("_tooltip_mov")){
                    if (e.coordinate[0] > x3) {
                            tooltip_overlay.getElement().classList.remove("ol-tooltipmov-right");
                            tooltip_overlay.getElement().classList.add("ol-tooltipmov-left");
                    } else {
                            tooltip_overlay.getElement().classList.remove("ol-tooltipmov-left");
                            tooltip_overlay.getElement().classList.add("ol-tooltipmov-right");
                    }
                    if (e.coordinate[1] > y3) {
                            tooltip_overlay.getElement().classList.remove("ol-tooltipmov-top");
                            tooltip_overlay.getElement().classList.add("ol-tooltipmov-bottom");
                    } else {
                            tooltip_overlay.getElement().classList.remove("ol-tooltipmov-bottom");
                            tooltip_overlay.getElement().classList.add("ol-tooltipmov-top");
                    }
                }else{
                    if (e.coordinate[0] > x3) {
                        tooltip_overlay.getElement().classList.remove("ol-tooltip-right");
                        tooltip_overlay.getElement().classList.add("ol-tooltip-left");
                } else {
                        tooltip_overlay.getElement().classList.remove("ol-tooltip-left");
                        tooltip_overlay.getElement().classList.add("ol-tooltip-right");
                }
                }
                
                /*
                if (e.coordinate[1] > y3) {
                        tooltip_overlay.getElement().classList.remove("ol-tooltip-top");
                        tooltip_overlay.getElement().classList.add("ol-tooltip-bottom");
                } else {
                        tooltip_overlay.getElement().classList.remove("ol-tooltip-bottom");
                        tooltip_overlay.getElement().classList.add("ol-tooltip-top");
                }
                */
                tooltip_overlay.getElement().querySelector(".content").innerHTML = contenido

                //componente.toltipcontent = componente._fn_tooltip(f_l[0].getProperties());
            } else {
                tooltip_overlay_nomov.setPosition(undefined)
                tooltip_overlay_mov.setPosition(undefined)
                //tooltipelement.classList.remove("show")
            }
            map.hover_feature = feature;
        } else {

            tooltip_overlay_nomov.setPosition(undefined)
            tooltip_overlay_mov.setPosition(undefined)
            //tooltipelement.classList.remove("show")
        }
    } else {
        map.getTargetElement().style.cursor = '';
        tooltip_overlay_nomov.setPosition(undefined)
        tooltip_overlay_mov.setPosition(undefined)
        //tooltipelement.classList.remove("show")
        map.hover_feature = undefined;
    }
}