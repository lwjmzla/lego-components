// !import { BBDrawerMove } from 'lwj-lego-components';  不能通过这样引入类型，看怎么解决
export interface BBDrawerMove {
  open(): void;
  close(): void;
  getCurrentWidth(): number;
}