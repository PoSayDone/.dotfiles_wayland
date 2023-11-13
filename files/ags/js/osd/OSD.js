import { Utils, Widget } from '../imports.js';
import FontIcon from '../misc/FontIcon.js';
import Progress from '../misc/Progress.js';
import Indicator from '../services/onScreenIndicator.js';

export const OnScreenIndicator = ({ height = 48, width = 400 } = {}) => Widget.Box({
    class_name: 'indicator',
    css: 'margin-bottom: 24px;',
    child: Widget.Revealer({
        transition: 'slide_up',
        connections: [[Indicator, (revealer, value) => {
            revealer.revealChild = value > -1;
        }]],
        child: Progress({
            width,
            height,
            vertical: false,
            connections: [[Indicator, (progress, value) => progress.setValue(value)]],
            child: Widget.Stack({
                vpack: 'center',
                hpack: 'end',
                hexpand: true,
                vexpand: true,
                items: [
                    ['true', Widget.Icon({
                        vpack: 'center',
                        vexpand: false,
                        size: 24,
                        connections: [[Indicator, (icon, _v, name) => icon.icon = name || '']],
                    })],
                    ['false', FontIcon({
                        vpack: 'center',
                        vexpand: true,
                        css: 'font-size: 24px;',
                        connections: [[Indicator, (icon, _v, name) => icon.icon = name || '']],
                    })],
                ],
                connections: [[Indicator, (stack, _v, name) => {
                    stack.shown = `${!!Utils.lookUpIcon(name)}`;
                }]],
            }),
        }),
    }),
});

export default monitor => Widget.Window({
    name: `indicator${monitor}`,
    monitor,
    class_name: 'indicator',
    layer: 'overlay',
    anchor: ['bottom'],
    child: OnScreenIndicator(),
});
