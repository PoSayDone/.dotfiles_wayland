import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';

import { Label } from 'resource:///com/github/Aylur/ags/widget.js';
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';

const getLayout = () => {
    const devices = JSON.parse(exec('hyprctl -j devices'));
    var keyboard = devices.keyboards.find(k => k.name === 'logitech-logig-mkeyboard');
    if (keyboard === undefined)
        keyboard = devices.keyboards.find(k => k.name === 'at-translated-set-2-keyboard');
    const activeKeymap = keyboard.active_keymap;
    const layout = activeKeymap.slice(0, 2).toLowerCase();
    return layout;
};

export default () => Label({
    class_name: 'keyboardlayout',
    yalign: 0.477,
    xalign: 0.51,
    connections: [[Hyprland, label => label.label = getLayout()]],
});
