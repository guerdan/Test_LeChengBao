import { _decorator, Color, Component, Vec3, Node, EventTouch, Tween, tween, Sprite } from 'cc';
const { ccclass, property } = _decorator;

const frame: number = 1 / 60;

@ccclass('AnButton')
export class AnButton extends Component {
    
    private tween_Show: Tween<AnButton>;
    private tween_Repeat: Tween<AnButton>;
    private tween_TouchStart: Tween<AnButton>;
    private tween_TouchEnd: Tween<AnButton>;

    public scale_x: number;
    public scale_y: number;
    public rotation_z: number;
    public scale_for_touch: number = 1;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEndLog, this);
    }


    hide() {
        this.node.scale = Vec3.ZERO;
        this.scale_x = 0;
        this.scale_y = 0;
        this.rotation_z = 0;
        this.scale_for_touch = 1;
        this.getComponent(Sprite).color = Color.WHITE;

        this.tween_Show?.stop()
        this.tween_Repeat?.stop()
        this.tween_TouchStart?.stop()
        this.tween_TouchEnd?.stop()
    }


    animForShow() {
        this.hide();

        if (!this.tween_Show || !this.tween_Repeat) {

            let action_scale_update = (target, ratio) => {
                this.node.scale = new Vec3(
                    this.scale_x * this.scale_for_touch,
                    this.scale_y * this.scale_for_touch,
                    1);
            }

            let tween_scale = tween<AnButton>(this)
                .to(9 * frame, { scale_x: 1.16, scale_y: 0.83 }, { easing: 'linear', onUpdate: action_scale_update })
                .to(3 * frame, { scale_x: 0.83, scale_y: 1.16 }, { easing: 'sineOut', onUpdate: action_scale_update })
                .to(3 * frame, { scale_x: 1.1, scale_y: 0.9 }, { easing: 'sineOut', onUpdate: action_scale_update })
                .to(3 * frame, { scale_x: 1, scale_y: 1 }, { easing: 'sineOut', onUpdate: action_scale_update })
                .to(3 * frame, { scale_y: 1.03 }, { easing: 'sineOut', onUpdate: action_scale_update })
                .to(3 * frame, { scale_y: 1 }, { easing: 'sineOut', onUpdate: action_scale_update })

            let action_rotation_update = (target, ratio) => {
                this.node.eulerAngles = new Vec3(0, 0, this.rotation_z);
            }
            let tween_rotation = tween<AnButton>(this)
                .to(3 * frame, { rotation_z: -6 }, { easing: 'sineOut', onUpdate: action_rotation_update, })
                .to(3 * frame, { rotation_z: 0 }, { easing: 'sineOut', onUpdate: action_rotation_update, })
                .to(3 * frame, { rotation_z: 6 }, { easing: 'sineOut', onUpdate: action_rotation_update, })
                .to(3 * frame, { rotation_z: 0 }, { easing: 'sineOut', onUpdate: action_rotation_update, })
                .to(3 * frame, { rotation_z: -6 }, { easing: 'sineOut', onUpdate: action_rotation_update, })
                .to(3 * frame, { rotation_z: 0 }, { easing: 'sineOut', onUpdate: action_rotation_update, })
                .to(3 * frame, { rotation_z: -3 }, { easing: 'sineOut', onUpdate: action_rotation_update, })
                .to(3 * frame, { rotation_z: 0 }, { easing: 'sineOut', onUpdate: action_rotation_update, })



            this.tween_Repeat = tween<AnButton>(this)
                .to(30 * frame, { scale_x: 1.03, scale_y: 0.97 }, { easing: 'sineOut', onUpdate: action_scale_update })
                .to(30 * frame, { scale_x: 1, scale_y: 1 }, { easing: 'sineOut', onUpdate: action_scale_update })
                .union()
                .repeatForever()

            this.tween_Show = tween(this)
                .parallel(tween_scale, tween_rotation)
                .call(() => {
                    this.tween_Repeat.start()
                })

        }


        this.tween_Show.start()
    }



    onTouchStart(event: EventTouch) {
        this.tween_TouchEnd?.stop()

        this.getComponent(Sprite).color = new Color(128, 128, 128);
        if (!this.tween_TouchStart) {
            this.tween_TouchStart = tween<AnButton>(this)
                .to(6 * frame, { scale_for_touch: 0.8 }, { easing: 'sineOut' })
                .to(4 * frame, { scale_for_touch: 0.88 }, { easing: 'sineOut' })
                .to(4 * frame, { scale_for_touch: 0.8 }, { easing: 'sineOut' })
                .to(4 * frame, { scale_for_touch: 0.84 }, { easing: 'sineOut' })
                .to(4 * frame, { scale_for_touch: 0.8 }, { easing: 'sineOut' })
        }

        this.tween_TouchStart.start()
    }


    onTouchEnd(event: EventTouch) {
        this.tween_TouchStart?.stop()

        this.getComponent(Sprite).color = Color.WHITE;
        if (!this.tween_TouchEnd) {
            this.tween_TouchEnd = tween<AnButton>(this)
                .to(4 * frame, { scale_for_touch: 1.15 }, { easing: 'sineOut' })
                .to(4 * frame, { scale_for_touch: 1 }, { easing: 'sineOut' })
                .to(4 * frame, { scale_for_touch: 1.1 }, { easing: 'sineOut' })
                .to(4 * frame, { scale_for_touch: 1 }, { easing: 'sineOut' })
                .to(4 * frame, { scale_for_touch: 1.05 }, { easing: 'sineOut' })
                .to(4 * frame, { scale_for_touch: 1 }, { easing: 'sineOut' })
        }

        this.tween_TouchEnd.start()
    }


    onTouchEndLog() {
        console.log("onTouchEnd")
    }
}