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
//    .api
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
    nodeLabel: new WeakMap(),
    nodeColor: new WeakMap(),
    nodeWidth: new WeakMap(),
    edgeLabel: new WeakMap(),
    edgeColor: new WeakMap(),
    edgeWidth: new WeakMap(),
    reset: function(option){
      if( option === undefined || option === 'nodePosition' ) this.nodePosition = new WeakMap();
      if( option === undefined || option === 'nodeLabel' ) this.nodeLabel = new WeakMap();
      if( option === undefined || option === 'nodeColor' ) this.nodeColor = new WeakMap();
      if( option === undefined || option === 'nodeWidth' ) this.nodeWidth = new WeakMap();
      if( option === undefined || option === 'edgeLabel' ) this.edgeLabel = new WeakMap();
      if( option === undefined || option === 'edgeColor' ) this.edgeColor = new WeakMap();
      if( option === undefined || option === 'edgeWidth' ) this.edgeWidth = new WeakMap();
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
      if( option === undefined || option === 'nodeLabel' ){
        agens.cy.nodes().map( ele => {
          if( agens.caches.nodeLabel.has(ele) )
            ele.style('label', agens.graph.defaultSetting.hideNodeTitle 
                        ? '' : agens.caches.nodeLabel.get(ele));
        });
      }
      if( option === undefined || option === 'nodeColor' ){
        agens.cy.nodes().map( ele => {
          if( agens.caches.nodeColor.has(ele) )
            ele.style('background-color', agens.caches.nodeColor.get(ele));
        });
      }
      if( option === undefined || option === 'nodeWidth' ){
        agens.cy.nodes().map( ele => {
          if( agens.caches.nodeWidth.has(ele) )
            ele.style('width', agens.caches.nodeWidth.get(ele));
            ele.style('height', agens.caches.nodeWidth.get(ele));
        });
      }
      if( option === undefined || option === 'edgeLabel' ){
        agens.cy.edges().map( ele => {
          if( agens.caches.edgeLabel.has(ele) )
            ele.style('label', agens.graph.defaultSetting.hideEdgeTitle
                        ? '' : agens.caches.edgeLabel.get(ele) );
        });
      }
      if( option === undefined || option === 'edgeColor' ){
        agens.cy.edges().map( ele => {
          if( agens.caches.edgeColor.has(ele) )
            ele.style('line-color', agens.caches.edgeColor.get(ele) );
            ele.style('source-arrow-color', agens.caches.edgeColor.get(ele) );
            ele.style('target-arrow-color', agens.caches.edgeColor.get(ele) );            
        });
      }
      if( option === undefined || option === 'edgeWidth' ){
        agens.cy.edges().map( ele => {
          if( agens.caches.edgeWidth.has(ele) )
            ele.style('width', agens.caches.edgeWidth.get(ele) );
        });
      }
    }
  };

  /////////////////////////////////////////////////////////
  //  NAMESPACE: agens.styles
  /////////////////////////////////////////////////////////

  agens.styles = {
    nodeLabel: function(e){
      if( e.data('$$style') !== undefined ){
        if( e.data('$$style')._self.label !== null )
          return e.data('props').hasOwnProperty(e.data('$$style')._self.label) ? 
                  e.data('props')[e.data('$$style')._self.label] : '';
        if( e.data('$$style')._label.label !== null )
          return e.data('props').hasOwnProperty(e.data('$$style')._label.label) ? 
                  e.data('props')[e.data('$$style')._label.label] : '';
      }
      return e.data('name');
    },
    nodeColor: function(e){
      if( e.data('$$style') !== undefined ){
        if( e.data('$$style')._self.color !== null ) return e.data('$$style')._self.color;
        if( e.data('$$style')._label.color !== null ) return e.data('$$style')._label.color;
      }
      return '#68bdf6';
    },
    nodeWidth: function(e){
      if( e.data('$$style') !== undefined ){
        if( e.data('$$style')._self.size !== null ) return e.data('$$style')._self.size;
        if( e.data('$$style')._label.size !== null ) return e.data('$$style')._label.size;
      }
      return '55px';
    },
    edgeLabel: function(e){
      if( e.data('$$style') !== undefined ){
        if( e.data('$$style')._self.label !== null )
          return e.data('props').hasOwnProperty(e.data('$$style')._self.label) ? 
                  e.data('props')[e.data('$$style')._self.label] : '';
        if( e.data('$$style')._label.label !== null )
          return e.data('props').hasOwnProperty(e.data('$$style')._label.label) ? 
                  e.data('props')[e.data('$$style')._label.label] : '';
      }
      return e.data('name');
    },
    edgeColor: function(e){
      if( e.data('$$style') !== undefined ){
        if( e.data('$$style')._self.color !== null ) return e.data('$$style')._self.color;
        if( e.data('$$style')._label.color !== null ) return e.data('$$style')._label.color;
      }
      return '#a5abb6';
    },
    edgeWidth: function(e){
      if( e.data('$$style') !== undefined ){
        if( e.data('$$style')._self.size !== null ) return e.data('$$style')._self.size;
        if( e.data('$$style')._label.size !== null ) return e.data('$$style')._label.size;
      }
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
          // "panning-cursor": "grabbing",
        }}, {
        selector: 'node',
        css: {
          'label': function(e){
              if( !agens.caches.nodeLabel.has(e) ) 
                agens.caches.nodeLabel.set(e, agens.styles.nodeLabel(e));
              if( agens.graph.defaultSetting.hideNodeTitle ) return '';
              return agens.caches.nodeLabel.get(e);
            },

          'text-wrap':'wrap',
          'text-max-width':'75px',
          'text-halign': 'center',    // text-halign: left, center, right
          'text-valign': 'center',       // text-valign: top, center, bottom
          'color': 'white',
          'font-weight': 400,
          'font-size': 12,
          'text-opacity': 1,
          // 'background-color': '#68bdf6',
          'background-color': function(e){
            if( !agens.caches.nodeColor.has(e) ) 
              agens.caches.nodeColor.set(e, agens.styles.nodeColor(e));
            return agens.caches.nodeColor.get(e);
          },

          // 'shape': 'eclipse',
          'width': function(e){
            if( !agens.caches.nodeWidth.has(e) ) 
              agens.caches.nodeWidth.set(e, agens.styles.nodeWidth(e));
            return agens.caches.nodeWidth.get(e);
          },
          'height': function(e){
            if( !agens.caches.nodeWidth.has(e) ) 
              agens.caches.nodeWidth.set(e, agens.styles.nodeWidth(e));
            return agens.caches.nodeWidth.get(e);
          },

          'border-width':'3',
          'border-color':'#5fa9dc'
        }},{
          selector: ':parent',
          css: {
            'z-compound-depth': 'bottom',
            'background-opacity': 0.333,
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
        }},{
          selector: 'node:selected',                /// 선택한 노드의 변화 (.highlighted로 인해 선택된 노드를 강조하고자 하려면 border값으로 변화를 줘야함)
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
          selector: 'node.expand',                /// 기존과 다른 엣지버전의 변화
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
          'label':function(e){
            if( !agens.caches.edgeLabel.has(e) ) 
              agens.caches.edgeLabel.set(e, agens.styles.edgeLabel(e));
            if( agens.graph.defaultSetting.hideEdgeTitle ) return '';
            return agens.caches.edgeLabel.get(e);
          },

          'text-rotation':'autorotate',
          'text-margin-y': -10,
          'color': '#c8c8c8',
          'opacity': 1,
  //        'text-outline-width': 2,
  //        'text-outline-color': '#797979',
          // 'line-color': '#a5abb6',
          'line-color': function(e){
            if( !agens.caches.edgeColor.has(e) ) 
              agens.caches.edgeColor.set(e, agens.styles.edgeColor(e));
            return agens.caches.edgeColor.get(e);
          },

          'line-style': 'solid',            // line-style: solid, dotted, dashed
          'width': function(e){
            if( !agens.caches.edgeWidth.has(e) ) 
              agens.caches.edgeWidth.set(e, agens.styles.edgeWidth(e));
            return agens.caches.edgeWidth.get(e);
          },

          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': function(e){
            if( !agens.caches.edgeColor.has(e) ) 
              agens.caches.edgeColor.set(e, agens.styles.edgeColor(e));
            return agens.caches.edgeColor.get(e);
          },
          'source-arrow-shape': 'none',
          'source-arrow-color': function(e){
            if( !agens.caches.edgeColor.has(e) ) 
              agens.caches.edgeColor.set(e, agens.styles.edgeColor(e));
            return agens.caches.edgeColor.get(e);
          },
          'font-size': 12
        }}, {
        selector: 'edge:selected',             /// 엣지만 클릭했을 경우 변화
        css: {
          'background-color': '#ffffff',
          'target-arrow-color': '#483d41',
          'source-arrow-color': '#483d41',
          'line-color': '#483d41',

          'width': 12,
          'opacity': 1,
          'color': '#483d41',
          'text-margin-y': -15,
          'text-outline-width': 2,
          'text-outline-color': 'white',
        }}, {
        selector: 'edge:locked',              /// 엣지를 잠궜을 때 변화
        css: {
          // 'width': 4,
          'opacity': 1,
          'line-color': '#433f40',
          'target-arrow-color': '#433f40',
          'source-arrow-color': '#433f40'
        }}, {
        selector: 'edge.expand',             /// 기존과 다른 엣지버전의 변화
        css: {
          // 'width': 3,
          'border-style':'double',
          'opacity': 0.6,
          'line-color': 'orange',
          'target-arrow-color': 'orange',
          'source-arrow-color': 'orange',
        }}, {
        selector: 'node.highlighted',      // 노드 클릭시 노드 및 엣지 변화(연결된 노드도 같이 변화됨)
        css: {
          'background-color': '#fff',
          'width':'65px',
          'height':'65px',
          'color':'#5fa9dc',
          'target-arrow-color': '#a5abb6',
          'source-arrow-color': '#a5abb6',
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
        selector: '.edgehandles-hover',   /// 엣지 드래그한 후 선택한 노드의 변화
        css: {
          'background-color': '#d80001'
        }},{
        selector: '.edgehandles-source',    /// 선택된 노드의 드래그시 변화
        css: {
          'border-width': 10,
          'border-color': '#d80001',
          'background-color':'#d80001',
          'text-outline-color': '#d80001',
        }},{
        selector: '.edgehandles-target',   /// 엣지연결할 타겟의 노드변화
        css: {
          // 'border-width': 2,
          'border-color': 'white',
          'text-outline-color': '#d80001',
        }},{
        selector: '.edgehandles-preview, .edgehandles-ghost-edge', /// 선택된 노드에 연결될 엣지의 예상변화
        css: {
          'line-color': '#d80001',
          'target-arrow-color': '#d80001',
          'source-arrow-color': '#d80001',
        }
      }
    ]
  };

  // Public Property : defaultSetting
  agens.graph.defaultSetting = {
    container: document.getElementById('agens-graph'),
    // style: agens.graph.stylelist['dark'],
    elements: { nodes: [], edges: [] },   // agens.graph.demoData[0],
    layout: { name: 'cose', fit: true, padding: 30, boundingBox: undefined, nodeDimensionsIncludeLabels: true, randomize: true },
      //   animate: true, animationDuration: 2800, maxSimulationTime: 2800, 
      //   ready: function(){}, stop: function(){},
      //   // for euler
      //   springLength: edge => 120, springCoeff: edge => 0.0008,
      // },
      
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
    hideNodeTitle: true,
    hideEdgeTitle: true,

    /////////////////////////////////////////////////////////
    // NAMESPACE: agens.cy
    /////////////////////////////////////////////////////////

    // ready function
    ready: function(e){
      agens.cy = e.cy;
      agens.graph.ready(e.cy);
    },

  };

  // Public Function : graphFactory()
  agens.graph.graphFactory = function(target, selectionType, useCxtmenu){
    agens.graph.defaultSetting.container = target;
    agens.graph.defaultSetting.selectionType = selectionType;
    
    // meta 그래프의 경우 CxtMenu 기능이 필요 없음
    agens.graph.defaultSetting.useCxtmenu = useCxtmenu;

    return cytoscape(agens.graph.defaultSetting);
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
      cy.cyPosition = e.cyPosition;
    });

    cy.on('tap', function(e){
      // 바탕화면 탭 이벤트
      if( e.target === cy ){
        // cancel selected and highlights
        if( cy.$api.view !== undefined ) cy.$api.view.removeHighlights();
        cy.$(':selected').unselect();
        cy.pivotNode = null;
        // user Function
        if( window['angularComponentRef'] !== null && window['angularComponentRef'].cyCanvasCallback !== undefined )
          (window['angularComponentRef'].cyCanvasCallback)();
      }

      // 노드 또는 에지에 대한 클릭 이벤트
      else{
        if( !e.target.isNode() && !e.target.isEdge() ) return;

        // user Function
        if( window['angularComponentRef'] !== null && window['angularComponentRef'].cyElemCallback !== undefined )
          (window['angularComponentRef'].cyElemCallback)(e.target);

        // if NODE
        if( e.target.isNode() ){
          cy.pivotNode = e.target;
          // user Function
          if( window['angularComponentRef'] !== null && window['angularComponentRef'].cyNodeCallback !== undefined )
            (window['angularComponentRef'].cyNodeCallback)(e.target);
        }

        // if EDGE
        if( e.target.isEdge() ){
          // user Function
          if( window['angularComponentRef'] !== null && window['angularComponentRef'].cyEdgeCallback !== undefined )
            (window['angularComponentRef'].cyEdgeCallback)(e.target);
        }          
      }

    });

    // ** NOTE: mouseover 이벤트는 부하가 심하고 작동도 하지 않음!
    // cy.on('mouseover', 'node', function(e){
    // });

    cy.cyQtipMenuCallback = function( id, targetName ){
      var cyTarget = cy.elements(`node[id='${id}']`);
      if( cyTarget.size() == 0 ) return;

      // user Function
      if( window['angularComponentRef'] !== null && window['angularComponentRef'].cyQtipMenuCallback !== undefined )
        (window['angularComponentRef'].cyQtipMenuCallback)(cyTarget, targetName);
    };

    // ==========================================
    // ==  cy utilities 등록
    // ==========================================

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
      var connectedNodes = cy.collection();
      // if limit recursive, stop searching
      if( maxHops <= 0 ) return connectedNodes;

      // 새로운 label타입의 edge에 대한 connectedNodes 찾기
      // 1) 새로운 label 타입의 edges (uniqLabels에 없는)
      var connectedEdges = node.connectedEdges().filter(function(i, ele){
        return uniqLabels.indexOf(ele.data('labels')[0]) < 0;
      });
      // 2) edge에 연결된 node collection을 merge (중복제거)
      for( var i=0; i<connectedEdges.size(); i+=1 ){
        connectedNodes = connectedNodes.merge( connectedEdges[i].connectedNodes() );
      }
      // connectedNodes = connectedNodes.difference(node);                           // 자기 자신은 빼고
      // 3) uniqLabels 갱신
      connectedEdges.forEach(elem => {
        if( uniqLabels.indexOf(elem.data('labels')[0]) < 0 ){
          uniqLabels.push(elem.data('labels')[0]);
        } 
      });

      // 4) append recursive results
      maxHops -= 1;
      connectedNodes.difference(node).forEach(elem => {
        var collection = cy.$api.view.findNeighbors(elem, uniqLabels.slice(0), maxHops);
        connectedNodes = connectedNodes.merge( collection );
      });
      // 5) return connectedNodes
      // console.log( 'neighbors ==>', connectedNodes, uniqLabels, maxHops );

      // 6) callback run
      if( callback !== undefined ) callback();
      
      return connectedNodes;
    };


    // ==========================================
    // ==  cy cxtmenu 등록
    // ==========================================
    
    // cxt menu for core
    if( agens.graph.defaultSetting.hasOwnProperty('useCxtmenu') && agens.graph.defaultSetting.useCxtmenu )
      cy.cxtmenu({
        menuRadius: 80,
        selector: 'core',
        fillColor: 'rgba(0, 60, 0, 0.65)',
        commands: [{
            content: '<span style="display:inline-block; width:20px; font-size:10pt">Reverse select</span>',
            select: function(){
              var selected = cy.elements(':selected');
              var unselected = cy.elements(':unselected');
              cy.$api.view.removeHighlights();
              selected.unselect();
              unselected.select();
            }
          },{
            content: '<span style="display:inline-block; width:20px; font-size:10pt">Hide unselected</span>',
            select: function(){
              cy.$api.view.hide(cy.elements(":unselected"));
            },
          },{
            content: '<span style="display:inline-block; width:20px; font-size:10pt">Show all</span>',
            select: function(){
              cy.$api.view.show(cy.elements(":hidden"));
            },
          },{
            content: '<span style="display:inline-block; width:20px; font-size:10pt">Unlock all</span>',
            select: function(){
              cy.elements(":locked").unlock();
            }
          },{
            content: '<span style="display:inline-block; width:20px; font-size:10pt">Remove expands</span>',
            select: function(){
              cy.elements(".expand").remove();
            }
          }
        ]
      });
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
      var pos = ele.position();
      agens.caches.nodePosition.set( ele, {x: pos.x, y: pos.y} );
    })
  };

  // private Function
  agens.graph.makeid = function(){
    var text = "_id_";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

  agens.graph.exportImage = function(filename, watermark){
    if( agens.cy === null ) return;

    // image data
    var pngContent = agens.cy.png({ maxWidth : '1600px', full : true, scale: 1.2 });

    // this is to remove the beginning of the pngContent: data:img/png;base64,
    var b64data = pngContent.substr(pngContent.indexOf(",") + 1);
    var blob = b64toBlob(b64data, "image/png");

    // watermark 없으면 그냥 saveAs
    if( watermark === null || watermark === '' ) saveAs(blob, filename);
    // watermark 추가
    else {
      var blobUrl = URL.createObjectURL(blob);
      $('<img>', {
        src: blobUrl
      }).watermark({
        text: watermark, textSize: 40, textWidth: 800, textColor: 'white', opacity: 0.7, margin: 5,
        outputType: "png", outputWidth: 'auto', outputHeight: 'auto',
        done: function(imgURL){
          var b64data2 = imgURL.substr(imgURL.indexOf(",") + 1);
          var blob2 = b64toBlob(b64data2, "image/png")
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

    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  };

}( window.agens = window.agens || {} ));
