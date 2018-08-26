import { StateType } from '../app.config';

export interface ILogs {

  id: number;
  userName: string;
  userIp: string;
  query: string;
  state: StateType;
  message: string;
  create_dt: number;    // timestamp
  update_dt: number;    // timestamp

};

export interface IProject {

  id: number;
  userName: string;
  userIp: string;
  title: string;
  description: string;
  create_dt: number;    // timestamp
  update_dt: number;    // timestamp
  sql: string;
  graph_json: string;

};