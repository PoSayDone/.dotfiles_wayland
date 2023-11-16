import Clock from './widgets/Clock.js';
import Workspaces from './widgets/Workspaces.js';
import Keyboardlayout from './widgets/KeyboardLayout.js';
import Separator from '../misc/Separator.js';
import HoverableButton from '../misc/HoverableButton.js';
import { App, Widget } from '../imports.js';

import * as battery from '../misc/battery.js';

import { ActiveApp } from './widgets/ActiveApp.js';
import { Weather } from './widgets/Weather.js';
import SystemIndicators from './widgets/SystemIndicators.js';

const Battery = () => Widget.Box({
    class_name: 'battery',
    hpack: 'end',
    children: [
        battery.Indicator(),
        battery.LevelLabel(),
    ],
});

const Launcher = () => HoverableButton({
    class_name: 'launcher',
    on_primary_click: () => App.toggleWindow('applauncher'),
    child: Widget.Box({
        class_name: 'launcher__icon',
        vpack: 'center',
        hpack: 'center',
        hexpand: true,
        vexpand: true,
    }),
});

const Left = () => Widget.Box({
    class_name: 'bar__left',
    orientation: 'horizontal',
    hpack: 'start',
    hexpand: true,
    children: [
        Launcher(),
        Separator(),
        Workspaces(),
        Separator(),
        ActiveApp(),
    ],
});

const Center = () => Widget.Box({
    class_name: 'bar__center',
    child: Clock(),
});

const Right = () => Widget.Box({
    class_name: 'bar__right',
    orientation: 'horizontal',
    hpack: 'end',
    children: [
        Keyboardlayout(),
        Separator(),
        SystemIndicators(),
        Weather(),
        Battery(),
    ],
});

export default monitor => Widget.Window({
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusive: true,
    monitor,
    hexpand: true,
    child: Widget.CenterBox({
        class_name: 'bar',
        startWidget: Left(),
        centerWidget: Center(),
        endWidget: Right(),
    }),
});
