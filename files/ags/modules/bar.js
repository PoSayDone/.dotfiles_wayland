import { Clock } from './clock.js';
import { Workspaces } from './hyprland.js';
import { Keyboardlayout } from './keyboardlayout.js';
import { Separator } from './misc.js';
const { SystemTray } = ags.Service;

import * as battery from './battery.js';
import * as bluetooth from './bluetooth.js';
import * as network from './network.js';
import * as audio from './audio.js';

const { App } = ags;
const { CenterBox, Box, Button, EventBox, Icon } = ags.Widget;

const Battery = () => Box({
    className: 'battery',
    halign: 'end',
    children: [
        battery.Indicator(),
        battery.LevelLabel(),
    ],
});

const Quicksettings = () => EventBox({
    onPrimaryClick: () => App.toggleWindow('controlcenter'),
    child: Box({
        className: 'bar__quicksettings',
        children: [
            network.Indicator(),
            Separator(),
            bluetooth.Indicator(),
            Separator(),
            audio.SpeakerIndicator(),
            Box({
                className: 'tray',
                connections: [[SystemTray, box => {
                    box.children = SystemTray.items.map(item => Button({
                        child: Icon(),
                        onPrimaryClick: (_, event) => item.activate(event),
                        onMiddleClick: (_, event) => item.secondaryActivate(event),
                        onSecondaryClick: (_, event) => item.openMenu(event),
                        connections: [[item, button => {
                            button.child.icon = item.icon;
                            button.tooltipMarkup = item.tooltipMarkup;
                        }]],
                    }));
                }]],
            }),
        ],
    }),
});

const Launcher = () => Button({
    className: 'launcher',
    child: Box({
        className: 'launcher__icon',
        valign: 'center',
        halign: 'center',
        hexpand: true,
        vexpand: true,
    }),
});

const Left = () => Box({
    className: 'bar__left',
    orientation: 'horizontal',
    halign: 'start',
    hexpand: true,
    children: [
        Launcher(),
        Separator(),
        Workspaces(),
    ],
});

const Center = () => Box({
    className: 'bar__center',
    children: [
        Clock(),
    ],
});

const Right = () => Box({
    className: 'bar__right',
    orientation: 'horizontal',
    halign: 'end',
    children: [
        Keyboardlayout(),
        Separator(),
        Quicksettings(),
        Separator(),
        Battery(),
    ],
});

export const BarContainer = () => CenterBox({
    className: 'bar',
    startWidget: Left(),
    centerWidget: Center(),
    endWidget: Right(),
});
