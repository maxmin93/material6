import * as _ from 'lodash';

import { IGraph, ILabel, IElement, INode, IEdge, IProperty, IStyle } from './agens-data-types';
import { all } from '../../../node_modules/@types/q';

export class Label implements ILabel {
  readonly group: string = 'labels';      // group == 'labels'

  id: string;
  type: string;       // type = { nodes, edges }
  name: string = '';
  owner: string = '';
  desc: string = '';
  size: number = 0;
  size_not_empty: number = 0;
  is_dirty: boolean = true;
  properties: Array<IProperty> = new Array<IProperty>();
  sources: Array<string> = new Array<string>();   // source_neighbors
  targets: Array<string> = new Array<string>();   // target_neighbors

  scratch: {
    size_not_empty?: number;
    is_dirty?: boolean;
    _style?: IStyle;          // styles (user property appended after API call)
  };

  constructor(id:string, type:string){
    this.group = 'labels';
    this.id = id;
    this.type = type;
  }

  get color():string {
    return (this.scratch._style) ? this.scratch._style.color : undefined;
  }
  set color(val:string) {
    if( this.scratch._style ) this.scratch._style.color = val;
    else this.scratch._style = <IStyle>{ color: val, width: undefined, title: undefined };
  }

  get width():string {
    return (this.scratch._style) ? this.scratch._style.width : undefined;
  }
  set width(val:string) {
    if( this.scratch._style ) this.scratch._style.width = val;
    else this.scratch._style = <IStyle>{ color: undefined, width: val, title: undefined };
  }

  get title():string {
    return (this.scratch._style) ? this.scratch._style.title : undefined;
  }
  set title(val:string) {
    if( this.scratch._style ) this.scratch._style.title = val;
    else this.scratch._style = <IStyle>{ color: undefined, width: undefined, title: val };
  }
};

export class Element implements IElement {
  readonly group: string;     // group == 'nodes'

  data: {
    id: string;
    parent?: string;
    label: string;
    props: Map<string,any>;
    size: number;
  };
  scratch: {
    _style?: IStyle;          // styles (user property appended after API call)
  };
  classes?: string;

  constructor(group:string, id:string = undefined){
    // generate random id
    if( id === undefined ){
      let chars = "abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890";
      id = _.sampleSize(chars, 12).join('');
    }
    this.group = group;
    this.data.id = id;
    this.data.label = "";
    this.data.props = new Map<string,any>();
    this.data.size = 0;
  }

  get id():string {
    return this.data.id;
  }
  set id(id:string) {
    this.data.id = id;
  }

  get type():string {
    return this.group;
  };

  get label():string {
    return this.data.label;
  };
  set label(name:string) {
    this.data.label = name;
  };

  getPropertyId():string {
    return this.data.props['id'];
  };
  getPropertyName():string {
    return this.data.props['name'];
  };
  getProperty(key:string):any {
    return this.data.props[key];
  };
  setProperty(key:string, val:any) {
    this.data.props.set(key, val);
  };

  addClass(style:string) {
    if( this.classes === undefined || this.classes === '' ) this.classes = style;
    else if( this.classes.includes(style) ) undefined;
    else this.classes += ' ' + style;
  }
  removeClass(style:string) {
    if( this.classes === undefined || this.classes === '' ) this.classes = style;
    else if( !this.classes.includes(style) ) undefined;
    else this.classes = this.classes.replace(style, '').replace(/&nbsp;&nbsp;/g,' ');
  }

  get color():string {
    return (this.scratch._style) ? this.scratch._style.color : undefined;
  }
  set color(val:string) {
    if( this.scratch._style ) this.scratch._style.color = val;
    else this.scratch._style = <IStyle>{ color: val, width: undefined, title: undefined };
  }

  get width():string {
    return (this.scratch._style) ? this.scratch._style.width : undefined;
  }
  set width(val:string) {
    if( this.scratch._style ) this.scratch._style.width = val;
    else this.scratch._style = <IStyle>{ color: undefined, width: val, title: undefined };
  }

  get title():string {
    return (this.scratch._style) ? this.scratch._style.title : undefined;
  }
  set title(val:string) {
    if( this.scratch._style ) this.scratch._style.title = val;
    else this.scratch._style = <IStyle>{ color: undefined, width: undefined, title: val };
  }
};

export class Node extends Element implements INode {
  readonly group: string = 'nodes';

  constructor(id:string){
    super('nodes', id);
  }

  getNeighbors():string[] {
    return this.scratch['_neighbors'];
  }
  setNeighbors(labels:ILabel[]) {
    this.scratch['_neighbors'] = new Array<string>();
    if( !labels ) return;
    labels.forEach(val => {
      if( val.type == 'nodes' && val.name == this.label )
        this.scratch['_neighbors'] = this.scratch['_neighbors'].concat(val.targets);
    });
  }
}

export class Edge extends Element implements IEdge {
  readonly group: string = 'edges';

  data: {
    id: string;
    label: string;
    props: Map<string,any>;
    size: number;
    source: string;           // only EDGE
    target: string;           // only EDGE
  };

  constructor(id:string, source:string, target:string){
    super('edges', id);
    this.source = source;
    this.target = target;
  }

  get source():string {
    return this.data.source;
  }
  set source(id:string) {
    this.data.source = id;
  }

  get target():string {
    return this.data.target;
  }
  set target(id:string) {
    this.data.target = id;
  }
}

