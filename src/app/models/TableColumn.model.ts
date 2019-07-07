import { Cell } from './Cell.model';

export class TableColumn {
    colName: string;
    data: Cell[];

    constructor(cName: string, cellList: Cell[]) {
        this.colName = cName;
        this.data = [...cellList];
    }
}
