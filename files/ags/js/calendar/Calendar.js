import PopupWindow from '../misc/PopupWindow.js';
import { Widget } from '../imports.js';

export default ({ anchor = ['top'], layout = 'top' } = {}) => PopupWindow({
    name: 'calendar',
    layout,
    anchor,
    content: Widget.Box({
        class_name: 'calendar',
        children: [
            Widget.Calendar({
                hexpand: true,
                hpack: 'center',
            }),
        ],
    }),
});
