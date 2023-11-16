import GLib from 'gi://GLib';

import { App } from '../../imports.js';
import HoverableButton from '../../misc/HoverableButton.js';

export default ({
    format = '%a %d %b, %H:%M',
    interval = 1000,
    ...props
} = {}) => HoverableButton({
    cursor: 'pointer',
    on_clicked: () => App.toggleWindow('calendar'),
    class_name: 'clock',
    ...props,
    connections: [[interval, label =>
        label.label = GLib.DateTime.new_now_local().format(format),
    ]],
});
