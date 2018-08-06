import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';

declare var agens : any;

@Component({
  selector: 'app-cyto-tutorials',
  templateUrl: './cyto-tutorials.component.html',
  styleUrls: ['./cyto-tutorials.component.css']
})
export class CytoTutorialsComponent implements AfterViewInit, OnDestroy {

  // cytoscape 객체 
  private cy:any = null;
  private showNodeTitle:boolean = false;

  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('divGraph') divGraph: ElementRef;

  constructor(
    private _ngZone: NgZone,    
  ) { 
    // prepare to call this.function from external javascript
    window['angularComponentRef'] = {
      zone: this._ngZone,
      cyCanvasCallback: () => this.cyCanvasCallback(),
      cyElemCallback: (target) => this.cyElemCallback(target),
      cyNodeCallback: (target) => this.cyNodeCallback(target),
      cyQtipMenuCallback: (target, value) => this.cyQtipMenuCallback(target, value),
      component: this
    };    
  }
  ngOnDestroy(){
    window['angularComponentRef'] = undefined;
  }

  ngAfterViewInit(){
    // Cytoscape 생성
    this.cy = agens.graph.graphFactory(
      this.divGraph.nativeElement, 'single', true
    );

    setTimeout(() => {
      this.cy.resize();
      console.log( 'cyto-tutorial initialize..');

      this.cy.json(GRAPH_DATA); 
      // refit canvas
      this.cy.fit( this.cy.elements(), 100);
      // refresh style
      this.cy.style(agens.graph.stylelist['dark']).update();
    }, 30);
  }

  cyCanvasCallback(){
  }
  cyElemCallback(target){
    console.log( 'cyElemCallback:', `[${target.id()}]`, target.data('name') );
  }
  cyNodeCallback(target){
  }
  cyQtipMenuCallback(target, value){
  }

  /////////////////////////////////////////////////////////////////
  // Centrality methods
  /////////////////////////////////////////////////////////////////

  rollback(){
    // agens.caches.rollback('nodePosition');
    agens.caches.rollback();
  }

  layoutEuler(){
    this.changeLayout('euler');
  }
  changeLayout(layout:string='euler'){
    // 선택된 elements 들이 있으면 그것들을 대상으로 실행, 없으면 전체
    let elements = this.cy.elements(':selected');
    if( elements.length <= 1) elements = this.cy.elements(':visible');

    let layoutOption = {
      name: layout,
      fit: true, padding: 30, boundingBox: undefined, 
      nodeDimensionsIncludeLabels: true, randomize: true,
      animate: true, animationDuration: 2800, maxSimulationTime: 2800, 
      ready: function(){}, stop: function(){},
      // for euler
      springLength: edge => 120, springCoeff: edge => 0.0008,
    };

    // adjust layout
    let layoutHandler = elements.layout(layoutOption);
    layoutHandler.on('layoutstart', function(){
      // 최대 3초(3000ms) 안에는 멈추도록 설정
      setTimeout(function(){
        layoutHandler.stop();
      }, 3000);
    });
    layoutHandler.run();
  }

  //////////////////////////////////////////////////////////

  cyGrouping(members:any=undefined, title:string=undefined){
    let nodes = this.cy.nodes(':selected');
    if( members && !members.empty() ) nodes = members;
    let edges = nodes.connectedEdges();
    if( nodes.empty() ) return;
    
    console.log('cyGrouping:', nodes);
    this.cy.elements(':selected').unselect();
    let nodes_clone = nodes.clone();
    nodes.remove();

    let parentId = agens.graph.makeid();
    let parentPos = nodes.boundingBox();
    let parent = { "group": "nodes", "data": { "id": parentId, "name": title, "parent": undefined }
                , "position": { "x": (parentPos.x1+parentPos.x2)/2, "y": (parentPos.y1+parentPos.y2)/2 } }
    let parentNode = this.cy.add(parent);
    parentNode.style('width', parentPos.x2-parentPos.x1 );
    parentNode.style('height', parentPos.y2-parentPos.y1 );
    if( title ) parentNode.style('label', title );

    nodes_clone.forEach(v => {
      v._private.data.parent = parentId;
    });
    this.cy.add(nodes_clone);
    this.cy.add(edges);
  }

  cyDegrouping(target:any=undefined){
    if( !target || !target.isNode() ) {
      let nodes = this.cy.nodes(':selected');
      if( nodes.empty() || !nodes[0].isParent() ) return;
      target = nodes[0];
    }

    console.log('cyDegrouping:', target);
    let children = target.children().nodes();
    let edges = children.connectedEdges();
    children.forEach(e => {
      e._private.data.parent = undefined;
    });
    target.remove();
    this.cy.add(children);
    this.cy.add(edges);
  }

  //////////////////////////////////////////////////////////

  toggleProgress(option:string=undefined){
    if( option === undefined ){
      this.progressBar.nativeElement.style.visibility = 
        (this.progressBar.nativeElement.style.visibility == 'visible') ? 'hidden' : 'visible';
    }
    else{
      this.progressBar.nativeElement.style.visibility = option;
    }
  }
  toggleTitle(option:boolean=undefined){
    agens.graph.defaultSetting.hideNodeTitle = (option === undefined) ? 
        !agens.graph.defaultSetting.hideNodeTitle : option;

    agens.cy.style(agens.graph.stylelist['dark']).update();
  }

}

const GRAPH_DATA = {
  "elements":{
    "nodes":[
      { "group": "nodes", "data": { "id": "n0" }, "position": { "x": 122.50374073928583, "y": 367.98329788349827 } }
      ,{ "group": "nodes", "data": { "id": "n1" }, "position": { "x": 192.8417373253659, "y": 284.95661123237153 } }
      ,{ "group": "nodes", "data": { "id": "n2" }, "position": { "x": 322.7502148778555, "y": 424.4053013372906 } }
      ,{ "group": "nodes", "data": { "id": "n3" }, "position": { "x": 218.4787200381016, "y": 397.0689640913272 } }
      ,{ "group": "nodes", "data": { "id": "n4" }, "position": { "x": -20.468826662938394, "y": 352.94586364352034 } }
      ,{ "group": "nodes", "data": { "id": "n5" }, "position": { "x": 38.2395571029856, "y": 285.0461346952574 } }
    ],
    "edges":[
      { "group": "edges", "data": { "id": "e0", "source": "n0", "target": "n1"  },  "position": {} }
      ,{ "group": "edges", "data": { "id": "e1", "source": "n2", "target": "n3"  },  "position": {} }
      ,{ "group": "edges", "data": { "id": "e2", "source": "n4", "target": "n5"  },  "position": {} }
      ,{ "group": "edges", "data": { "id": "e3", "source": "n0", "target": "n3"  },  "position": {} }
      ,{ "group": "edges", "data": { "id": "e4", "source": "n2", "target": "n3"  },  "position": {} }
    ]
  }
};

const JSON_DATA = 
[{
  "group": "nodes", "data": { "id": "n0" }, "position": { "x": 122.50374073928583, "y": 367.98329788349827 },
 }, {
  "group": "nodes", "data": { "id": "n0:n0", "parent": "n0" }, "position": { "x": 209.0674320882374, "y": 382.7065284623535 },
 }, {
  "group": "nodes", "data": { "id": "n0:n1", "parent": "n0" }, "position": { "x": 142.2888292225041, "y": 450.92046107173917 },
 }, {
  "group": "nodes", "data": { "id": "n0:n2", "parent": "n0" }, "position": { "x": 182.2214883151621, "y": 298.98997315342774 },
 }, {
  "group": "nodes", "data": { "id": "n0:n3", "parent": "n0" }, "position": { "x": 121.52030011362558, "y": 368.17931244036083 },
}, {
  "group": "nodes", "data": {    "id": "n0:n4",    "parent": "n0"  },  "position": {    "x": 35.94004939033425,    "y": 354.52885825453217  },
}, {
  "group": "nodes", "data": {    "id": "n0:n5",    "parent": "n0"  },  "position": {    "x": 98.2395571029856,    "y": 285.0461346952574  },
}, {
  "group": "nodes", "data": {    "id": "n2"  },  "position": {    "x": 467.0267020797804,    "y": 80.2773842699168  },
}, {
  "group": "nodes", "data": {    "id": "n2:n0",    "parent": "n2"  },  "position": {    "x": 417.4178741533308,    "y": 125.50672352045078  },
}, {
  "group": "nodes", "data": {    "id": "n2:n1",    "parent": "n2"  },  "position": {    "x": 548.2154780707372,    "y": 106.01744529364254  },
}, {
  "group": "nodes", "data": {    "id": "n2:n4",    "parent": "n2"  },  "position": {    "x": 469.07146102347747,    "y": 45.714770370076906  },
}, {
  "group": "nodes", "data": {    "id": "n2:n7",    "parent": "n2"  },  "position": {    "x": 385.8379260888237,    "y": 35.04804501938281  },
}, {
  "group": "nodes", "data": {    "id": "n3"  },  "position": {    "x": 570.0696797318568,    "y": 365.3791298251542  },
}, {
  "group": "nodes", "data": {    "id": "n3:n1",    "parent": "n3"  },  "position": {    "x": 420.8386954496027,    "y": 481.72758382436245  },
}, {
  "group": "nodes", "data": {    "id": "n3:n3",    "parent": "n3"  },  "position": {    "x": 446.29982440410276,    "y": 298.3920866191955  },
}, {
  "group": "nodes", "data": {    "id": "n3:n7",    "parent": "n3"  },  "position": {    "x": 415.9437139883562,    "y": 392.69607603288597  },
}, {
  "group": "nodes", "data": {    "id": "p0",    "parent": "n3"  },  "position": {    "x": 633.4146202751332,    "y": 347.8836539152288  },
}, {
  "group": "nodes", "data": {    "id": "n3:n0",    "parent": "p0"  },  "position": {    "x": 636.5506526886438,    "y": 350.8661004189891  },
}, {
  "group": "nodes", "data": {    "id": "n3:n2",    "parent": "p0"  },  "position": {    "x": 552.633595074909,    "y": 378.53275341426115  },
}, {
  "group": "nodes", "data": {    "id": "n3:n4",    "parent": "p0"  },  "position": {    "x": 628.8212503757277,    "y": 436.73663200451165  },
}, {
  "group": "nodes", "data": {    "id": "n3:n5",    "parent": "p0"  },  "position": {    "x": 714.1956454753574,    "y": 312.4509501679866  },
}, {
  "group": "nodes", "data": {    "id": "n3:n6",    "parent": "p0"  },  "position": {    "x": 635.2142950493853,    "y": 259.03067582594593  },
}, {
  "group": "nodes", "data": {    "id": "n4"  },  "position": {    "x": 326.3876669777849,    "y": 258.3029296178655  },
}, {
  "group": "nodes", "data": {    "id": "n5"  },  "position": {    "x": 290.10860135152006,    "y": 99.31675442830439  },
}, {
  "group": "nodes", "data": {    "id": "n6"  },  "position": {    "x": 272.3840520665526,    "y": 182.5287195618913  },
}, {
  "group": "nodes", "data": {    "id": "n7"  },  "position": {    "x": 317.195608111733,    "y": 342.7874286188903  },
}, {
  "group": "nodes", "data": {    "id": "n1:n4"  },  "position": {    "x": 309.02204423693934,    "y": 453.3065572098769  },
}, {
  "group": "nodes", "data": {    "id": "n1:n5"  },  "position": {    "x": 314.06982432382256,    "y": 539.3443748178611  },
},


{
  "group": "edges", "data": {    "id": "e0",    "source": "n0:n4",    "target": "n0:n5"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e3",    "source": "n0:n2",    "target": "n0:n5"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e4",    "source": "n2:n1",    "target": "n2:n4"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e5",    "source": "n0:n3",    "target": "n0:n4"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e6",    "source": "n3",    "target": "n2"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e7",    "source": "n5",    "target": "n6"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e8",    "source": "n5",    "target": "n2"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e9",    "source": "n3:n3",    "target": "n3:n2"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e11",    "source": "n0:n0",    "target": "n0:n1"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e12",    "source": "n0:n3",    "target": "n0:n2"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e13",    "source": "n3:n6",    "target": "n3:n0"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e14",    "source": "n3:n4",    "target": "n3:n2"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e15",    "source": "n3:n3",    "target": "n2:n0"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e16",    "source": "n2:n4",    "target": "n2:n7"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e17",    "source": "n3:n7",    "target": "n3:n3"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e18",    "source": "n3:n2",    "target": "n3:n0"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e19",    "source": "n6",    "target": "n4"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e20",    "source": "n4",    "target": "n3"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e23",    "source": "n0",    "target": "n7"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e24",    "source": "n0:n3",    "target": "n0:n5"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e28",    "source": "n0:n0",    "target": "n0:n2"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e30",    "source": "n0:n0",    "target": "n0:n3"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e33",    "source": "n7",    "target": "n3"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e34",    "source": "n3:n1",    "target": "n3:n7"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e36",    "source": "n0:n3",    "target": "n0:n1"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e39",    "source": "n3:n0",    "target": "n3:n4"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e41",    "source": "n2:n0",    "target": "n2:n4"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e43",    "source": "n3:n0",    "target": "n3:n5"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e45",    "source": "n7",    "target": "n4"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e46",    "source": "n2:n7",    "target": "n2:n0"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e47",    "source": "n2:n1",    "target": "n3:n6"  },  "position": {},
}, {
  "group": "edges", "data": {    "id": "e49",    "source": "n3:n6",    "target": "n3:n5"  },  "position": {},
}, {
  "group": "edges", "data": { "id": "e1", "source": "n3:n7", "target": "n1:n4" }, "position": {},
}, {
  "group": "edges", "data": { "id": "e2", "source": "n0:n0", "target": "n1:n4" }, "position": {},
}, {
  "group": "edges", "data": { "id": "e10", "source": "n1:n5", "target": "n1:n4" }, "position": {},  
}];
