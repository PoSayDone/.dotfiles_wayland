import { Box } from 'resource:///com/github/Aylur/ags/widget.js';

export default ({ class_name = '', ...props } = {}) => Box({
    ...props,
    hexpand: false,
    vexpand: false,
    class_name: [...class_name.split(' '), 'separator'].join(' '),
});
