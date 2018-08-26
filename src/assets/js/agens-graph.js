// Title: Agens Graph Utilities using Cytoscape
// Right: Bitnine.net
// Author: Byeong-Guk Min <maxmin93@gmail.com>

// Self-Executing Anonymous Func: Part 2 (Public &amp; Private)
// ** 참고
// https://stackoverflow.com/a/5947280/6811653

// Structure
// ----------------------
//  agens
//    .cy
//    .graph
//      .defaultSetting, .defaultStyle, .demoData[], .layoutTypes[]
//      .ready(), .loadData(), saveFile(), saveImage()
//    .$api
//      .view
//      .unre
//

(function( agens, undefined ) {

  // sub namespaces : graph, api, dialog
  agens.cy = null;
  agens.graph = agens.graph || {};

  /////////////////////////////////////////////////////////
  //  NAMESPACE: agens.caches
  /////////////////////////////////////////////////////////

  agens.caches = {
    nodePosition: new WeakMap(),
    reset: function(option){
      if( option === undefined || option === 'nodePosition' ) this.nodePosition = new WeakMap();
    },
    rollback: function(option){
      if( option === undefined || option === 'nodePosition' ){
        agens.cy.nodes().map( ele => {
          if( agens.caches.nodePosition.has(ele) ){
            ele.position( agens.caches.nodePosition.get(ele) );
          } 
        });
        agens.cy.fit( agens.cy.elements(), 30);
      }
    }
  };

  /////////////////////////////////////////////////////////
  //  NAMESPACE: agens.styles
  /////////////////////////////////////////////////////////

  agens.styles = {
    nodeLabel: function(e){
      if( e.scratch('_style') && e.scratch('_style').title )
        if( e.data('props') && e.data('props').hasOwnProperty(e.scratch('_style').title) ) 
          return e.data('props')[e.scratch('_style').title];
      return '';
    },
    nodeColor: function(e){
      if( e.scratch('_style') && e.scratch('_style').color ) 
        return e.scratch('_style').color;
      return '#68bdf6';
    },
    nodeWidth: function(e){
      if( e.scratch('_style') && e.scratch('_style').width ) 
        return e.scratch('_style').width;
      return '55px';
    },
    edgeLabel: function(e){
      if( e.scratch('_style') && e.scratch('_style').title )
        if( e.data('props') && e.data('props').hasOwnProperty(e.scratch('_style').title) )
          return e.data('props')[e.scratch('_style').title];
      return '';
    },
    edgeColor: function(e){
      if( e.scratch('_style') && e.scratch('_style').color ) 
        return e.scratch('_style').color;
      return '#a5abb6';
    },
    edgeWidth: function(e){
      if( e.scratch('_style') && e.scratch('_style').width ) 
        return e.scratch('_style').width;
      return '2px';
    }
  };

  // Public Property : defaultStyle
  agens.graph.stylelist = {

    ///////////////////////////////////////////////////////
    // DARK theme
    //
    //  ** NODE background color
    // 'background-color': function(e){ return ( e.data('$$color') === undefined ) ? '#83878d' : e.data('$$color'); },
    //  ** EDGE line color
    // 'line-color': function(e){ return ( e.data('$$color') === undefined ) ? '#c8c8c8' : e.data('$$color'); },
    //
    ///////////////////////////////////////////////////////
    "dark" : [
      {
        selector: 'core',
        css: {
          "selection-box-color": "#11bf1c",
          "selection-box-opacity": 0.25,
          "selection-box-border-color": "#aaa",
          "selection-box-border-width": 1,
        }}, {
        selector: ':parent',
        css:{
          'background-opacity': 0.333,
          'z-compound-depth': 'bottom',
          'border-width':'1',
          'border-color':'#888',
          'border-style':'dotted',
          'padding-top': '10px',
          'padding-left': '10px',
          'padding-bottom': '10px',
          'padding-right': '10px',
          'text-valign': 'top',
          'text-halign': 'center',
          'background-color': '#B8BdB1'
      }}, {
        selector: 'node',
        css: {
          'label': function(e){
              if( e._private.cy.scratch('_config').hideNodeTitle ) return '';
              return agens.styles.nodeLabel(e);
              },
          'background-color': function(e){ return agens.styles.nodeColor(e); },
          'width':  function(e){ return agens.styles.nodeWidth(e); },
          'height': function(e){ return agens.styles.nodeWidth(e); },
  
          'text-wrap':'wrap',
          'text-max-width':'75px',
          'text-halign': 'center',    // text-halign: left, center, right
          'text-valign': 'center',    // text-valign: top, center, bottom
          'color': 'white',
          'font-weight': 400,
          'font-size': 12,
          'text-opacity': 1,
          'border-width':'3',
          'border-color':'#f5f5f5'
        }},{
        /// 선택한 노드의 변화 
        /// (.highlighted로 인해 선택된 노드를 강조하고자 하려면 border값으로 변화를 줘야함)          
        selector: 'node:selected',
        css: {
          'background-color': 'white',
          'color':'#68bdf6',
          'target-arrow-color': '#a5abb6',
          'source-arrow-color': '#a5abb6',
          'line-color': '#a5abb6',
          'border-style':'dashed',
          'border-color': '#68bdf6',
          'border-width':'3',
          'color':'#68bdf6'
        }}, {
        selector: 'node:locked',
        css: {
          'background-color': '#d64937',
          'text-outline-color': '#d64937',
          'color':'white',
          'border-color': '#d64937',
          'border-width': 3,
          'opacity': 1
        }}, {
        selector: 'node.expand',
        css: {
          'opacity': 0.6,
          'color':'black',
          'background-color': 'darkorange',
          'width': '40px',
          'height': '40px',
          'border-color':'orange',
          'border-width': 2,
        }}, {
        selector: 'edge',
        css: {
          'opacity': 1,
          'label': function(e){
            if( e._private.cy.scratch('_config').hideEdgeTitle ) return '';
            return agens.styles.edgeLabel(e);
            },
          'line-color': function(e){ return agens.styles.edgeColor(e); },
          'target-arrow-color': function(e){ return agens.styles.edgeColor(e); },
          'source-arrow-color': function(e){ return agens.styles.edgeColor(e); },
          'width':  function(e){ return agens.styles.edgeWidth(e); },

          'text-rotation':'autorotate',
          'text-margin-y': -12,
          'line-style': 'solid',            // line-style: solid, dotted, dashed
          'curve-style': 'bezier',
          'font-size': 12,
          'target-arrow-shape': 'triangle',
          'source-arrow-shape': 'none'
        }}, {
        /// 엣지만 클릭했을 경우 변화
        selector: 'edge:selected',             
        css: {
          'opacity': 1,
          'width': 10,
          'line-style': 'dashed',            // line-style: solid, dotted, dashed
          'line-color': '#83878d',
          'target-arrow-color': '#83878d',
          'source-arrow-color': '#83878d',
          'text-margin-y': -15,
          'text-outline-width': 2,
          'text-outline-color': 'white',
        }}, {
        /// 엣지를 잠궜을 때 변화
        selector: 'edge:locked',              
        css: {
          'opacity': 1,
          'line-color': '#433f40',
          'target-arrow-color': '#433f40',
          'source-arrow-color': '#433f40'
        }}, {
        /// 기존과 다른 엣지버전의 변화
        selector: 'edge.expand',             
        css: {
          'opacity': 0.6,
          'line-style':'dotted',
          'line-color': 'orange',
          'target-arrow-color': 'orange',
          'source-arrow-color': 'orange',
        }}, {
        // 노드 클릭시 노드 및 엣지 변화(연결된 노드도 같이 변화됨)
        selector: 'node.highlighted',      
        css: {
          'background-color': '#ffffff',
          'width':'65px',
          'height':'65px',
          'color':'#5fa9dc',
          'line-color': '#a5abb6',
          'border-style':'solid',
          'border-color': '#5fa9dc',
          'border-width': 4,
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.2s',
        }},{
        selector: 'edge.highlighted',
        css: {
          'width': 12,
          'opacity': 1,
          'color': '#483d41',
          'text-outline-width': 0,
          'line-style':'dashed',
          'line-color': '#83878d',
          'target-arrow-color': '#83878d',
          'source-arrow-color': '#83878d',
        }},{
        selector: '.traveled',
        css: {
          'background-color': '#11bf1c',
          'line-color': '#11bf1c',
          'target-arrow-color': 'black',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.2s'
        }},{
        /// 엣지 드래그한 후 선택한 노드의 변화
        selector: '.edgehandles-hover',
        css: {
          'background-color': '#d80001'
        }},{
        /// 선택된 노드의 드래그시 변화  
        selector: '.edgehandles-source',
        css: {
          'border-width': 10,
          'border-color': '#d80001',
          'background-color':'#d80001',
          'text-outline-color': '#d80001',
        }},{
        /// 엣지연결할 타겟의 노드변화          
        selector: '.edgehandles-target',   
        css: {
          'border-color': 'white',
          'text-outline-color': '#d80001',
        }},{
        /// 선택된 노드에 연결될 엣지의 예상변화
        selector: '.edgehandles-preview, .edgehandles-ghost-edge', 
        css: {
          'line-color': '#d80001',
          'target-arrow-color': '#d80001',
          'source-arrow-color': '#d80001',
        }
      }
    ]
  };
      
  // Public Property : defaultSetting
  // ==> cy 인스턴스 생성 후 cy.scratch('_config')로 저장됨
  //     : 스타일 함수 등에서는 e._private.cy.scratch('_config') 로 액세스 가능
  agens.graph.defaultSetting = {
    elements: { nodes: [], edges: [] },
    style: undefined,       // agens.graph.stylelist['dark'],
    layout: { name: 'preset',
        fit: true, padding: 100, boundingBox: undefined, 
        nodeDimensionsIncludeLabels: true, randomize: false,
        animate: 'end', refresh: 30, animationDuration: 800, maxSimulationTime: 2800,
        ready: function(){}, stop: function(){}
      },

    // initial viewport state:
    zoom: 1,
    pan: { x: 0, y: 0 },
    // interaction options:
    minZoom: 1e-2,
    maxZoom: 1e1,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
    selectionType: 'single',    // 'additive',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify: false,
    autounselectify: false,
    // rendering options:
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: true,    // false
    hideLabelsOnViewport: true,   // false
    textureOnViewport: false,     // false
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 0.2,
    pixelRatio: 'auto',

    // user-defined options:

    /////////////////////////////////////////////////////////
    // NAMESPACE: agens.cy
    /////////////////////////////////////////////////////////

    // ready function
    ready: function(e){
      agens.cy = e.cy;
      agens.graph.ready(e.cy);
    },
  };

  // 사용자 설정
  // ==> graphFactory(target, options) 의 options 입력으로 사용됨
  agens.graph.customSetting = {
    container: document.getElementById('agens-graph'),
    selectionType: 'single',    // 'single' or 'multiple'
    boxSelectionEnabled: false, // if single then false, else true
    hideNodeTitle: true,        // hide nodes' title
    hideEdgeTitle: true,        // hide edges' title
  };

  // Public Function : graphFactory()
  agens.graph.graphFactory = function(target, options){
    let customSetting = _.clone( agens.graph.defaultSetting );

    if( options === undefined ){
      customSetting = _.merge( customSetting, agens.graph.customSetting );
    }
    else{
      // selectionType 이 single이면 multiSelection 못하게
      if( !_.isNil( options['selectionType'] )){
        customSetting['selectionType'] = options['selectionType'];
        customSetting['boxSelectionEnabled'] = (options['selectionType'] !== 'single') ? true : false;
      }
      // data 그래프의 경우 성능향상을 위해 
      if( !_.isNil( options['hideNodeTitle'] )) customSetting['hideNodeTitle'] = options['hideNodeTitle'];
      if( !_.isNil( options['hideEdgeTitle'] )) customSetting['hideEdgeTitle'] = options['hideEdgeTitle'];
    }
    customSetting.container = target;

    let cy = cytoscape(customSetting);
    cy.scratch('_config', customSetting);

    return cy;
  };

  // Public Function : ready()
  // 1) qtip
  // 2) edgehandles
  // 3) panzoom
  agens.graph.ready = function(cy){
    if( cy === undefined || cy === null ) cy = agens.cy;
    cy.$api = {};

    cy.$api.panzoom = cy.panzoom({
      zoomFactor: 0.05, // zoom factor per zoom tick
      zoomDelay: 45, // how many ms between zoom ticks
      minZoom: 0.01, // min zoom level
      maxZoom: 10, // max zoom level
      fitPadding: 50, // padding when fitting
      panSpeed: 10, // how many ms in between pan ticks
      panDistance: 10, // max pan distance per tick
      panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
      panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
      panInactiveArea: 3, // radius of inactive area in pan drag box
      panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
      autodisableForMobile: true, // disable the panzoom completely for mobile (since we don't really need it with gestures like pinch to zoom)
      // additional
      zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
      fitSelector: undefined, // selector of elements to fit
      animateOnFit: function(){ // whether to animate on fit
        return false;
      },
      // icon class names
      sliderHandleIcon: 'fa fa-minus',
      zoomInIcon: 'fa fa-plus',
      zoomOutIcon: 'fa fa-minus',
      resetIcon: 'fa fa-expand'
    });
    // mouse wheel disable
    cy.$api.panzoom.userZoomingEnabled( false );

    // ==========================================
    // ==  cy events 등록
    // ==========================================

    // 마우스가 찍힌 위치를 저장 (해당 위치에 노드 등을 생성할 때 사용)
    cy.on('cxttapstart', function(e){
      cy.scratch('_cxtPosition', e.cyPosition);
    });

    cy.on('tap', function(e){
      // 바탕화면 탭 이벤트
      if( e.target === cy ){
        // cancel selected and highlights
        if( cy.$api.view !== undefined ) cy.$api.view.removeHighlights();
        cy.$(':selected').unselect();
        cy.pivotNode = null;

        // mapping user Functions
        if( !!window['angularComponentRef'] && !!window['angularComponentRef'].cyCanvasCallback )
          (window['angularComponentRef'].cyCanvasCallback)();
        if( !!window['metaGraphComponentRef'] && !!window['metaGraphComponentRef'].cyCanvasCallback )
          (window['metaGraphComponentRef'].cyCanvasCallback)();
        if( !!window['dataGraphComponentRef'] && !!window['dataGraphComponentRef'].cyCanvasCallback )
          (window['dataGraphComponentRef'].cyCanvasCallback)();
        if( !!window['statGraphComponentRef'] && !!window['statGraphComponentRef'].cyCanvasCallback )
          (window['statGraphComponentRef'].cyCanvasCallback)();
      }
      // 노드 또는 에지에 대한 클릭 이벤트
      else if( e.target.isNode() || e.target.isEdge() ){
        
        // mapping user Functions
        if( !!window['angularComponentRef'] && !!window['angularComponentRef'].cyElemCallback )
          (window['angularComponentRef'].cyElemCallback)(e.target);
        if( !!window['metaGraphComponentRef'] && !!window['metaGraphComponentRef'].cyElemCallback )
          (window['metaGraphComponentRef'].cyElemCallback)(e.target);
        if( !!window['dataGraphComponentRef'] && !!window['dataGraphComponentRef'].cyElemCallback )
          (window['dataGraphComponentRef'].cyElemCallback)(e.target);
        if( !!window['statGraphComponentRef'] && !!window['statGraphComponentRef'].cyElemCallback )
          (window['statGraphComponentRef'].cyElemCallback)(e.target);
        // NODE : if( e.target.isNode() ){}
        // EDGE : if( e.target.isEdge() ){}
      }

    });

    // ** NOTE: mouseover 이벤트는 부하가 심하고 작동도 하지 않음!
    // cy.on('mouseover', 'node', function(e){
    // });

    // ==========================================
    // ==  cy utilities 등록
    // ==========================================

    cy.$api.cyQtipMenuCallback = function( target, value ){
      // mapping user Functions
      if( !!window['angularComponentRef'] && !!window['angularComponentRef'].cyQtipMenuCallback )
        (window['angularComponentRef'].cyQtipMenuCallback)(target, value);
      if( !!window['metaGraphComponentRef'] && !!window['metaGraphComponentRef'].cyQtipMenuCallback )
        (window['metaGraphComponentRef'].cyQtipMenuCallback)(target, value);
      if( !!window['dataGraphComponentRef'] && !!window['dataGraphComponentRef'].cyQtipMenuCallback )
        (window['dataGraphComponentRef'].cyQtipMenuCallback)(target, value);
      if( !!window['statGraphComponentRef'] && !!window['statGraphComponentRef'].cyQtipMenuCallback )
        (window['statGraphComponentRef'].cyQtipMenuCallback)(target, value);
    };

    cy.$api.findById = function(id){
      let eles = cy.elements().getElementById(id);
      return eles.nonempty() ? result[0] : undefined;
    };

    // layouts = { bread-first, circle, cose, cola, 'klay', 'dagre', 'cose-bilkent', 'concentric" }
    // **NOTE: euler 는 속도가 빠르지만 간혹 stack overflow 문제를 일으켜 제외
    cy.$api.changeLayout = function(layout='cose', options=undefined){
      console.log( 'cy.$api.changeLayout:', layout);
      let elements = cy.elements(':visible');
      if( options && options.hasOwnProperty('useSelected') ){
        let selectedElements = cy.elements(':selected');
        if( options.useSelected && selectedElements.size() > 1 ) elements = selectedElements;
      } 
        
      let layoutOption = {
        name: layout,
        fit: true, padding: 50, boundingBox: undefined, 
        nodeDimensionsIncludeLabels: true, randomize: false,
        animate: 'end', refresh: 30, animationDuration: 800, maxSimulationTime: 2800,
        ready: function(){}, stop: function(){}
      };
      if( options && options.hasOwnProperty('ready') ) layoutOption.ready = options.ready;
      if( options && options.hasOwnProperty('stop') ) layoutOption.stop = options.stop;
  
      // adjust layout
      let layoutHandler = elements.layout(layoutOption);
      layoutHandler.run();
    }
  
    // on&off control: cy.edgehandles('enable') or cy.edgehandles('disable')
    cy.$api.edge = cy.edgehandles({
        preview: true,
        hoverDelay: 150,
        handleNodes: 'node',
        handlePosition: function( node ){ return 'middle top'; },
        handleInDrawMode: false,
        edgeType: function( sourceNode, targetNode ){ return 'flat'; },
        loopAllowed: function( node ){ return false; },
        nodeLoopOffset: -50,
      });
    cy.$api.edge.disable();

    cy.$api.unre = cy.undoRedo({
        isDebug: false, // Debug mode for console messages
        actions: {},// actions to be added
        undoableDrag: true, // Whether dragging nodes are undoable can be a function as well
        stackSizeLimit: undefined, // Size limit of undo stack, note that the size of redo stack cannot exceed size of undo stack
        ready: function () { // callback when undo-redo is ready
        }      
      });

    // Public Property : APIs about view and undoredo
    cy.$api.view = cy.viewUtilities({
      neighbor: function(node){
          return node.openNeighborhood();
      },
      neighborSelectTime: 600
    });

    // 이웃노드 찾기 : labels에 포함된 label을 갖는 node는 제외
    cy.$api.findNeighbors = function( node, uniqLabels, maxHops, callback=undefined ){
      // empty collection
      let connectedNodes = cy.collection();
      // if limit recursive, stop searching
      if( maxHops <= 0 ) return connectedNodes;

      // 새로운 label타입의 edge에 대한 connectedNodes 찾기
      // 1) 새로운 label 타입의 edges (uniqLabels에 없는)
      let connectedEdges = node.connectedEdges().filter(function(ele, i){
        return uniqLabels.indexOf(ele.data('label')) < 0;
      });
      // 2) edge에 연결된 node collection을 merge (중복제거)
      for( let i=0; i<connectedEdges.size(); i+=1 ){
        connectedNodes = connectedNodes.merge( connectedEdges[i].connectedNodes() );
      }
      // connectedNodes = connectedNodes.difference(node);                           // 자기 자신은 빼고
      // 3) uniqLabels 갱신
      connectedEdges.forEach(elem => {
        if( uniqLabels.indexOf(elem.data('label')) < 0 ){
          uniqLabels.push(elem.data('label'));
        } 
      });

      // 4) append recursive results
      maxHops -= 1;
      connectedNodes.difference(node).forEach(elem => {
        let collection = cy.$api.findNeighbors(elem, uniqLabels.slice(0), maxHops);
        connectedNodes = connectedNodes.merge( collection );
      });
      // 5) return connectedNodes
      // console.log( 'neighbors ==>', connectedNodes, uniqLabels, maxHops );

      // 6) callback run
      if( callback !== undefined ) callback();
      
      return connectedNodes;
    };

    cy.$api.grouping = function(members=undefined, title=undefined){
      let nodes = cy.nodes(':selected');
      if( members && !members.empty() ) nodes = members;
      let edges = nodes.connectedEdges();
      if( nodes.empty() ) return;
      
      cy.elements(':selected').unselect();
      nodes.remove();
  
      let parentId = agens.graph.makeid();
      let parentPos = nodes.boundingBox();
      let parent = { "group": "nodes", "data": { "id": parentId, "name": title, "parent": undefined }
                  , "position": { "x": (parentPos.x1+parentPos.x2)/2, "y": (parentPos.y1+parentPos.y2)/2 } }
      let parentNode = cy.add(parent);
      parentNode.style('width', parentPos.x2-parentPos.x1 );
      parentNode.style('height', parentPos.y2-parentPos.y1 );
      parentNode.scratch('_style', { "witdh": undefined, "color": '#b5b5b5', "title": 'name' } );
  
      nodes.forEach(v => {
        v._private.data.parent = parentId;
      });
      cy.add(nodes);
      cy.add(edges);
    }
  
    cy.$api.degrouping = function(target=undefined){
      if( !target || !target.isNode() ) {
        let nodes = cy.nodes(':selected');
        if( nodes.empty() || !nodes[0].isParent() ) return;
        target = nodes[0];
      }
  
      let children = target.children().nodes();
      let edges = children.connectedEdges();
      children.forEach(e => {
        e._private.data.parent = undefined;
      });
      target.remove();
      cy.add(children);
      cy.add(edges);
    }


  };


  /////////////////////////////////////////////////////////
  //  NAMESPACE: agens.graph
  /////////////////////////////////////////////////////////

  // Public Function : loadData()
  agens.graph.loadData = function(data){
    if( agens.cy === null ) return;

    // initialize
    agens.cy.elements().remove();

    agens.cy.batch(function(){
      // load data
      if( data.elements.nodes ){
        data.elements.nodes.map((ele) => {
          ele.group = "nodes";
          agens.cy.add( ele );
        });
      }
      if( data.elements.edges ){
        data.elements.edges.map((ele) => {
          ele.group = "edges";
          agens.cy.add( ele );
        });
      }

      // refresh style
      agens.cy.style(agens.graph.stylelist['dark']).update();
      // refit canvas
      agens.cy.fit( agens.cy.elements(), 30);
      // save original positions
      agens.graph.savePositions();
    });
  };

  // save Nodes' positions (original position)
  agens.graph.savePositions = function(){
    agens.caches.reset('nodePosition');
    agens.cy.nodes().map(ele => {
      let pos = ele.position();
      agens.caches.nodePosition.set( ele, {x: pos.x, y: pos.y} );
    })
  };

  // private Function
  agens.graph.makeid = function(){
    let text = "_id_";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( let i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

  agens.graph.exportImage = function(filename, watermark){
    if( agens.cy === null ) return;

    // image data
    let pngContent = agens.cy.png({ maxWidth : '1600px', full : true, scale: 1.2 });

    // this is to remove the beginning of the pngContent: data:img/png;base64,
    let b64data = pngContent.substr(pngContent.indexOf(",") + 1);
    let blob = b64toBlob(b64data, "image/png");

    // watermark 없으면 그냥 saveAs
    if( watermark === null || watermark === '' ) saveAs(blob, filename);
    // watermark 추가
    else {
      let blobUrl = URL.createObjectURL(blob);
      $('<img>', {
        src: blobUrl
      }).watermark({
        text: watermark, textSize: 40, textWidth: 800, textColor: 'white', opacity: 0.7, margin: 5,
        outputType: "png", outputWidth: 'auto', outputHeight: 'auto',
        done: function(imgURL){
          let b64data2 = imgURL.substr(imgURL.indexOf(",") + 1);
          let blob2 = b64toBlob(b64data2, "image/png")
          saveAs(blob2, filename);
          console.log( `image saved: "${filename}"`);
        }
      });
     }
  };

  // see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  };

}( window.agens = window.agens || {} ));
