import { StateType, RequestType } from '../global.config';
import { IDatasource, IGraph, ILabel, IRecord } from './agens-data-types';

export interface IResponseDto {
  group: string;

  state: StateType;   // enum Type
  message: string;
  _link?: string;
};

export interface ILabelDto extends IResponseDto {
  // group == 'label_info'

  request?: IRequestDto;
  label: ILabel;
};

export interface IClientDto extends IResponseDto {
  // group == 'label_info'
  
  ssid: string;
  valid: boolean; 
  user_name: string;
  user_ip: string;
  gid: number;
  product_name: string;
  product_version: string;
  timestamp: string;
};

export interface ISchemaDto extends IResponseDto {
  // group == 'schema'

  is_dirty: boolean;
  datasource: IDatasource;
  labels: Array<ILabel>;
};

export interface IRequestDto {
  ssid: string;
  txid?: string;
  type: RequestType;
  sql: string;
  command?: string;
  options?: any; 
};

export interface IResultDto extends IResponseDto {
  // group == 'result'

  request: IRequestDto;
  hasGraph: boolean;
  hasRecord: boolean;
  gid?: number;
};

export interface IGraphDto extends IResponseDto {
  // group == 'graph_dto'

  gid: number;
}

export interface IDoubleListDto extends IResponseDto {
  // group == 'dlist_dto'

  gid: number;
  sid?: number;
  eid?: number;
  result?: Array<Array<string>>;
}