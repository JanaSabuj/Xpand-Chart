export class ChartButton {
    chartName: string;
    disabled: boolean;

    constructor(cName: string, dis: boolean) {
        this.chartName = cName;
        this.disabled = dis;
    }
}
