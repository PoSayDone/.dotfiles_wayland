import GLib from 'gi://GLib';

import { Label } from 'resource:///com/github/Aylur/ags/widget.js';

export default ({
    format = '%a %d %b, %H:%M',
    interval = 1000,
    ...props
} = {}) => Label({
    class_name: 'clock',
    ...props,
    connections: [[interval, label =>
        label.label = GLib.DateTime.new_now_local().format(format),
    ]],
});
