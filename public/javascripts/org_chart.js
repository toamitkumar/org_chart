var labelType,
useGradients,
nativeTextSupport,
animate,
st;

 (function() {
    var ua = navigator.userAgent,
    iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
    typeOfCanvas = typeof HTMLCanvasElement,
    nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
    textSupport = nativeCanvasSupport
    && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native': 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
    elem: false,
    write: function(text) {
        if (!this.elem) {
            this.elem = document.getElementById('log');
            this.elem.innerHTML = text;
            this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
        }
    }
};

function navigateToPage(node, eventInfo, e) {
  if (typeof(node.id) == 'undefined') {
      return false;
  }

  $(".hsiOrgChTT").remove();

  var y = e.pageY;
  var tt = '<div class="hsiOrgChTT" style="left:' + getPosX(e) + 'px; top:' + getPosY(e) + 'px">';
  tt += '<div class="enabled"><div class="hsiSprite"></div><div class="subOrgChTxt">Navigate</div><div class="hsiClear"></div></div>';
  tt += '</div>';
  $("body").append(tt);
}

function drillDownMenu(node, eventInfo, e) {
    if (typeof(node.id) == 'undefined') {
        return false;
    }
    $(".hsiOrgChTT").remove();
    var id = node.id.split('de')[1];
    if (0 === id) {
        $.blockUI({
            message: '<div class="closeBlockUi"></div><iframe src="' + globalTargetsURL + '" width="985" height="600"></iframe>',
            css: {
                width: '950px',
                height: '500px',
                left: ($(window).width() - 950) / 2 + 'px',
                top: '5%',
                cursor: 'pointer'
            }
        });
        return false;
    }
    var y = e.pageY;
    var tt = '<div class="hsiOrgChTT" style="left:' + getPosX(e) + 'px; top:' + getPosY(e) + 'px">';
    if (node.data.has_children || node.data.level < 3) {
        tt += '<div class="binocularsCont enabled"><div class="hsiSprite binocularsIco"></div><div class="subOrgChTxt">Make Root</div><div class="hsiClear"></div></div>';
    } else {
        tt += '<div class="binocularsCont disabled"><div class="hsiSprite binocularsIco"></div><div class="subOrgChTxt">Make Root</div><div class="hsiClear"></div></div>';
    }

    tt += '<div class="orgChCont disabled"><div class="hsiSprite orgChIco"></div><div class="subOrgChTxt">Expand</div><div class="hsiClear"></div></div>';
    if (node.data.level == 2) {
        tt += '<div class="smPieCont enabled"><div class="hsiSprite smPieIco"></div><div class="subOrgChTxt">Analytics</div><div class="hsiClear"></div></div>';
    }
    if (node.data.level < 3) {
        tt += '<div class="suitcaseCont enabled"><div class="hsiSprite suitcaseIco"></div><div class="subOrgChTxt">Set Targets</div><div class="hsiClear"></div></div>';
    }
    tt += '<div class="suitcaseCont disabled"><div class="hsiSprite suitcaseIco"></div><div class="subOrgChTxt">Case Studies</div><div class="hsiClear"></div></div>';
    tt += '<div class="redFlCont disabled"><div class="hsiSprite redFlIco"></div><div class="subOrgChTxt">Flag it</div><div class="hsiClear"></div></div>';
    tt += '<div class="lightBlbCont disabled"><div class="hsiSprite lightBlbIco"></div><div class="subOrgChTxt">Set initiatives</div><div class="hsiClear"></div></div>';
    tt += '<div class="editCont disabled noBotBorder"><div class="hsiSprite editIco"></div><div class="subOrgChTxt">Notes</div><div class="hsiClear"></div></div>';
    tt += '</div>';
    $("body").append(tt);
    $('.orgChCont').live('click',
    function() {
        return false;
    });
    $('.lightBlbCont').live('click',
    function() {
        return false;
    });
    $('.redFlCont').live('click',
    function() {
        return false;
    });
    $('.editCont').live('click',
    function() {
        return false;
    });
}

function drawRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
}

function initTreeView(json, canvas_height) {
    st = new $jit.ST({
        injectInto: 'infovis',
        width: 980,
        height: canvas_height,
        offsetX: 365,
        // offsetY: -50,
        duration: 300,
        levelDistance: 50,
        constrained: false,
        levelsToShow: 5,
        Node: {
            overridable: true,
            height: 30,
            width: 110,
            type: 'roundrect',
            color: '#516395'
        },
        Edge: {
            type: 'bezier',
            overridable: true,
            color: '#AAB3CB',
            lineWidth: 1,
            dim: 30
        },
        onCreateLabel: function(label, node) {
            label.id = node.id;
            label.innerHTML = node.name;
            label.onclick = function() {
                st.onClick(node.id);
            };
            //set label styles
            var style = label.style;
            style.width = 205 + 'px';
            style.height = 20 + 'px';
            style.cursor = 'pointer';
            style.color = '#fff';
            style.fontSize = '0.8em';
            style.textAlign = 'left';
            style.paddingTop = '3px';
            style.paddingLeft = '5px';
            style.display = 'block';
        },
        onBeforePlotLine: function(adj) {
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                } else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        },
        Events: {
            enable: true,
            onClick: function() {window.location.href = "static.html"}
        }
    });

    //create a rounded corner node
    $jit.ST.Plot.NodeTypes.implement({
        'roundrect': {
            'render': function(node, canvas, animating) {
                var pos = node.pos.getc(true),
                nconfig = this.node,
                data = node.data;
                var ort;
                var wStats = parseInt(data.stats, 10);
                wStats = parseInt(wStats * 2.07, 10);
                var savings = data.savings;
                var width = nconfig.width,
                height = nconfig.height;
                var algnPos = this.getAlignedPos(pos, width, height);
                var ctx = canvas.getCtx();
                ort = this.config.orientation;
                ctx.beginPath();
                var r = 5;
                //corner radius
                var x = algnPos.x;
                var y = algnPos.y;
                var h;
                if (data.is_informative) {
                    h = 50;
                } else {
                    h = 25;
                }
                var w = width;
                drawRect(ctx, x, y, w, h, r);
                ctx.fillStyle = ('#516395')
                ctx.fill();
                if (!data.is_informative) {
                    //put a white space inside the node to create a feeling of two nodes
                    /*var ctx2 = canvas.getCtx();
                    ort = this.config.orientation;
                    ctx2.beginPath();
                    r = 0;
                    //corner radius
                    x = algnPos.x;
                    y = algnPos.y + 25;
                    h = 20;
                    w = width;
                    drawRect(ctx2, x, y, w, h, r)
                    ctx2.fillStyle = "rgb(255,255,255)";
                    ctx2.fill();
                    //put a white space inside the node to create a feeling of two nodes
                    var ctx3 = canvas.getCtx();
                    ort = this.config.orientation;
                    ctx3.beginPath();
                    r = 5;
                    //corner radius
                    x = algnPos.x;
                    y = algnPos.y + 30;
                    h = 10;
                    w = wStats;
                    drawRect(ctx3, x, y, w, h, r);
                    if (w !== 0) {
                        ctx3.fillStyle = "#E37222";
                    }
                    ctx3.fill();
                    ctx3.font = "normal 11px Arial";
                    ctx3.fillStyle = "#000";
                    ctx3.fillText("Savings:", x, y + 22);
                    ctx3.fillStyle = "#516395";
                    ctx3.font = "normal 11px Arial";
                    ctx3.fillText(" " + savings, x + 43, y + 22); */
                }
            }
        }
    });
    //load json data
    st.loadJSON(json);
    //compute node positions and layout
    st.compute();
    //optional: make a translation of the tree
    st.geom.translate(new $jit.Complex( - 200, 0), "current");
    //emulate a click on the root node.
    st.onClick(st.root);
    //end
}

function getPosX(e) {
    var x = 0;
    if (e.pageX || e.pageY) {
        x = e.pageX;
    }
    else if (e.clientX || e.clientY) {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    }
    return x;
}

function getPosY(e) {
    var y = 0;
    if (e.pageX || e.pageY) {
        y = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return y;
}