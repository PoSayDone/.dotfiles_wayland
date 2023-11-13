import { App, Widget } from '../../imports.js';
import Clock from '../../misc/Clock.js';
import Separator from '../../misc/Separator.js';
import * as vars from '../../variables.js';
import { USER, exec, execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

export default () => Widget.Box({
    class_name: 'controlcenter__header',
    children: [
        Widget.Box({
            children: [
                // Clock({
                //     class_name: 'controlcenter__clock',
                //     format: '%H:%M',
                // }),
                Widget.Label({
                    class_name: 'controlcenter__uptime',
                    binds: [['label', vars.uptime, 'value', t => `uptime ${t}`]],
                }),
            ],
        }),
        Widget.Box({
            hexpand: true,
        }),
        Widget.Button({
            class_name: 'controlcenter__theme',
            onPrimaryClickRelease: () => execAsync(`bash -c ${App.configDir}/bin/randomWallpaper`),
            child: Widget.Icon({ icon: 'applications-graphics-symbolic', size: 16 }),
        }),
        Separator(),
        Widget.Button({
            class_name: 'controlcenter__power',
            onPrimaryClickRelease: () => exec(`/home/${USER}/.config/rofi/bin/powermenu`),
            child: Widget.Icon({ icon: 'system-shutdown', size: 16 }),
        }),
    ],
});
