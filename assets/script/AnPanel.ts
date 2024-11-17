import { _decorator, Color, Component, EditBox, instantiate, Node, Sprite, UITransform, Vec3 } from 'cc';
import { AnButton } from './AnButton';
const { ccclass, property } = _decorator;


const config = {
    sideLength: 10,
    colors: [
        new Color("#FF0000"),
        new Color("#00FF00"),
        new Color("#0000FF"),
        new Color("#FFFF00"),
        new Color("#FF00FF")
    ],
    baseColorWeight: [20, 20, 20, 20, 20],

    uiCellSize: 50,
    uiCellSpacing: 2,
}

@ccclass('AnPanel')
export class AnPanel extends Component {

    @property(EditBox) xBox: EditBox;
    @property(EditBox) yBox: EditBox;
    @property(Node) generateBtn: Node;

    @property(Node) grid: Node;
    @property(Node) gridCell: Node;


    @property(AnButton) anBtn: AnButton;
    @property(Node) appearBtn: Node;


    onLoad() {
        this.generateBtn.on(Node.EventType.TOUCH_END, this.onClickGenerateBtn, this);
        this.appearBtn.on(Node.EventType.TOUCH_END, this.onClickAppearBtn, this);
        this.gridCell.active = false;

        AnPanel.excuteQ2()

        this.anBtn.animForShow();
    }

    //#region Q1，生成颜色方块地图

    private nodes: Node[][];
    private colorIndexMap: number[][];

    onClickGenerateBtn() {
        let x = parseInt(this.xBox.string);
        let y = parseInt(this.yBox.string);
        if (isNaN(x) || isNaN(y)) {
            console.warn("Invalid input");
            return;
        }

        this.generateInit();

        let sideLength = config.sideLength;
        //生成颜色
        for (let i = 0; i < sideLength; i++) {
            for (let j = 0; j < sideLength; j++) {
                let topCol = i > 0 ? this.colorIndexMap[i - 1][j] : undefined;
                let leftCol = j > 0 ? this.colorIndexMap[i][j - 1] : undefined;

                let weight_list = Array.from(config.baseColorWeight);


                let rest = 100;
                //已经确定的颜色的概率
                let fixed_index_list = [];

                let add_weight_action = (index: number, weight: number) => {
                    weight_list[index] += weight;

                    rest -= weight_list[index];
                    //最小为0
                    rest = Math.max(0, rest);
                    fixed_index_list.push(index);
                }

                //增加颜色的概率
                if (topCol != undefined && leftCol != undefined && topCol == leftCol) {
                    add_weight_action(topCol, y);
                } else {
                    if (topCol != undefined) {
                        add_weight_action(topCol, x);
                    }
                    if (leftCol != undefined) {
                        add_weight_action(leftCol, x);
                    }
                }

                //重新算其余颜色的概率
                for (let k = 0; k < weight_list.length; k++) {
                    if (fixed_index_list.indexOf(k) == -1) {
                        weight_list[k] = rest / (weight_list.length - fixed_index_list.length);
                    }
                }

                let colorIndex = this.randomFromWeight(weight_list);
                this.colorIndexMap[i][j] = colorIndex;

                let color = config.colors[colorIndex];
                this.nodes[i][j].getComponent(Sprite).color = color;
            }
        }

    }

    generateInit() {
        let sideLength = config.sideLength;

        //生成节点
        if (!this.nodes) {
            this.nodes = [];
            for (let i = 0; i < sideLength; i++) {
                let row = [];
                this.nodes.push(row);
                for (let j = 0; j < sideLength; j++) {
                    let node = instantiate(this.gridCell);
                    row.push(node);
                    node.active = true;
                    node.parent = this.grid;

                    let uiT = node.getComponent(UITransform);
                    uiT.width = config.uiCellSize;
                    uiT.height = config.uiCellSize;
                    node.position = new Vec3(i * (config.uiCellSize + config.uiCellSpacing)
                        , -j * (config.uiCellSize + config.uiCellSpacing), 0);
                }
            }
        }

        //初始化
        if (!this.colorIndexMap) {
            this.colorIndexMap = [];
            for (let i = 0; i < sideLength; i++) {
                let row = [];
                this.colorIndexMap.push(row);
                for (let j = 0; j < sideLength; j++) {
                    row.push(undefined);
                }
            }
        }

    }


    /** 按权重生成随机索引 */
    randomFromWeight(list: number[]): number {
        let sum = 0;
        for (let i = 0; i < list.length; i++) {
            sum += list[i];
        }

        let rand = Math.random() * sum;
        for (let i = 0; i < list.length; i++) {
            if (rand < list[i]) {
                return i;
            }
            rand -= list[i];
        }

        return 0;
    }

    //#endregion



    //#region Q2

    static excuteQ2() {
        console.log("Q2 Test " + this.funcQ2([10, 40, 5, 280], [234, 5, 2, 148, 23], 42));
        console.log("Q2 Test " + this.funcQ2([10, 40, 5, 280], [234, 5, 148, 23], 42));
        console.log("Q2 Test " + this.funcQ2([4, 40, 5, 280], [38, 5, 148, 23], 42));
    }

    /** 时间复杂度 O(n)*/
    static funcQ2(a: number[], b: number[], v: number): boolean {
        let map = new Map<number, number>();
        for (let i = 0; i < a.length; i++) {
            map.set(v - a[i], i);
        }

        for (let i = 0; i < b.length; i++) {
            let index = map.get(b[i]);
            if (index != undefined) {
                return true;
            }
        }

        return false;
    }

    //#endregion


    //#region Q3 见AnButton

    onClickAppearBtn(){
        this.anBtn.animForShow();
    }
   

    //#endregion
}



window["AnPanel_funcQ2"] = AnPanel.funcQ2;
