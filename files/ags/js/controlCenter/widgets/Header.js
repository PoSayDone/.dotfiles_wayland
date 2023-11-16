import { App, Widget, Utils } from '../../imports.js';
import Separator from '../../misc/Separator.js';
import * as vars from '../../variables.js';
import HoverableButton from '../../misc/HoverableButton.js';

export default () => Widget.Box({
    class_name: 'controlcenter__header',
    children: [
        Widget.Box({
            children: [
                Widget.Label({
                    class_name: 'controlcenter__uptime',
                    binds: [['label', vars.uptime, 'value', t => `uptime ${t}`]],
                }),
            ],
        }),
        Widget.Box({
            hexpand: true,
        }),
        HoverableButton({
            class_name: 'controlcenter__theme',
            onPrimaryClickRelease: () => Utils.execAsync(`bash -c ${App.configDir}/bin/randomWallpaper`),
            child: Widget.Icon({ icon: 'applications-graphics-symbolic', size: 16 }),
        }),
        Separator(),
        HoverableButton({
            class_name: 'controlcenter__power',
            onPrimaryClickRelease: () => Utils.exec(`/home/${Utils.USER}/.config/rofi/bin/powermenu`),
            child: Widget.Icon({ icon: 'system-shutdown', size: 16 }),
        }),
    ],
});
