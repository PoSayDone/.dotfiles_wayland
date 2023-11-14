import Clock from '../misc/Clock.js';
import Workspaces from './widgets/Workspaces.js';
import Keyboardlayout from './widgets/KeyboardLayout.js';
import Separator from '../misc/Separator.js';
import SysTray from './widgets/SysTray.js';
import { setupCursorHover } from '../misc/SetupCursorHover.js';
import { App, Widget } from '../imports.js';

import * as battery from '../battery.js';
import * as bluetooth from '../bluetooth.js';
import * as network from '../network.js';
import * as audio from '../audio.js';

import { Window, CenterBox, Box, Button } from 'resource:///com/github/Aylur/ags/widget.js';
import { ActiveApp } from './widgets/ActiveApp.js';
import { Weather } from './widgets/Weather.js';

const Battery = () => Box({
    class_name: 'battery',
    hpack: 'end',
    children: [
        battery.Indicator(),
        battery.LevelLabel(),
    ],
});

const Quicksettings = () => Widget.Button({
    class_name: 'bar__quicksettings_container',
    onPrimaryClick: () => App.toggleWindow('controlcenter'),
    child: Box({
        class_name: 'bar__quicksettings',
        children: [
            network.Indicator(),
            Separator(),
            bluetooth.Indicator(),
            Separator(),
            audio.SpeakerIndicator(),
            SysTray(),
        ],
    }),
    connections: [
        [App, (self, windowName, visible) => {
            if (windowName === 'controlcenter')
                self.toggleClassName('active', visible);
        }, 'window-toggled'],
    ],
    setup: button => setupCursorHover(button),
});

const Launcher = () => Button({
    class_name: 'launcher',
    onPrimaryClick: () => App.toggleWindow('applauncher'),
    child: Box({
        class_name: 'launcher__icon',
        vpack: 'center',
        hpack: 'center',
        hexpand: true,
        vexpand: true,
    }),
    setup: button => setupCursorHover(button),
});

const Left = () => Box({
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

const Center = () => Widget.Button({
    on_primary_click: () => App.toggleWindow('calendar'),
    class_name: 'bar__center',
    child: Clock(),
    setup: button => setupCursorHover(button),
});

const Right = () => Box({
    class_name: 'bar__right',
    orientation: 'horizontal',
    hpack: 'end',
    children: [
        Keyboardlayout(),
        Separator(),
        Quicksettings(),
        Weather(),
        Battery(),
    ],
});

export default monitor => Window({
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusive: true,
    monitor,
    hexpand: true,
    child: CenterBox({
        class_name: 'bar',
        startWidget: Left(),
        centerWidget: Center(),
        endWidget: Right(),
    }),
});
