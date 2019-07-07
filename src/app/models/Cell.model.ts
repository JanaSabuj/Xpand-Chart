export class Cell {
    row: number;
    column: number;
    data: any;
    selected: boolean;

    constructor(r: number, c: number, d: any) {
        this.row = r;
        this.column = c;
        this.data = d;
        this.selected = false;
    }
}
