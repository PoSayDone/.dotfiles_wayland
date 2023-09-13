const { Hyprland } = ags.Service;
const { Label } = ags.Widget;

const getLayout = () => {
    const devices = Hyprland.HyprctlGet('devices');
    var keyboard = devices.keyboards.find(k => k.name === 'logitech-logig-mkeyboard');
    if (keyboard === undefined)
        keyboard = devices.keyboards.find(k => k.name === 'at-translated-set-2-keyboard');
    const activeKeymap = keyboard.active_keymap;
    const layout = activeKeymap.slice(0, 2).toLowerCase();
    return layout;
};

export const Keyboardlayout = () => Label({
    className: 'keyboardlayout',
    yalign: 0.48,
    xalign: 0.51,
    connections: [[Hyprland, label => label.label = getLayout()]],
});
