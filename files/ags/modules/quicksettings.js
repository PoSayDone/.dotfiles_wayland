const { Service, App } = ags;
const { Network, Bluetooth } = ags.Service;
const { Button, Box, Icon, Label, Revealer } = ags.Widget;
const { timeout, execAsync } = ags.Utils;

import * as network from './network.js';
import * as bluetooth from './bluetooth.js';
import * as notifications from './notifications.js';
import * as audio from './audio.js';
import * as brightness from './brightness.js';
import * as media from './media.js';
import { Separator } from './misc.js';

class QSMenu extends Service {
    static { Service.register(this); }
    static instance = new QSMenu();
    static opened = '';
    static toggle(menu) {
        QSMenu.opened = QSMenu.opened === menu ? '' : menu;
        QSMenu.instance.emit('changed');
    }

    constructor() {
        super();
        App.instance.connect('window-toggled', (_a, name, visible) => {
            if (name === 'quicksettings' && !visible) {
                QSMenu.opened = '';
                QSMenu.instance.emit('changed');
            }
        });
    }
}

const Arrow = (menu, toggleOn) => Button({
    className: 'arrow',
    onClicked: () => {
        QSMenu.toggle(menu);
        if (toggleOn)
            toggleOn();
    },
    connections: [[QSMenu, button => {
        button.toggleClassName('opened', QSMenu.opened === menu);
    }]],
    child: Icon({
        icon: 'pan-end-symbolic',
        properties: [
            ['deg', 0],
            ['opened', false],
        ],
        connections: [[QSMenu, icon => {
            if (QSMenu.opened === menu && !icon._opened || QSMenu.opened !== menu && icon._opened) {
                const step = QSMenu.opened === menu ? 10 : -10;
                icon._opened = !icon._opened;
                for (let i = 0; i < 9; ++i) {
                    timeout(5 * i, () => {
                        icon._deg += step;
                        icon.setStyle(`-gtk-icon-transform: rotate(${icon._deg}deg);`);
                    });
                }
            }
        }]],
    }),
});

const SmallToggle = ({ icon, toggle, status, label }) => toggle({
    className: 'quicksettings__button',
    child: Box({
        children: [
            icon,
            Box({
                vertical: true,
                valign: 'center',
                children: [
                    Label({
                        className: 'text__bold',
                        halign: 'start',
                        label,
                    }),
                    status({ halign: 'start' }),
                ],
            }),
        ],
    }),
});

const ArrowToggle = ({ icon, connection, toggle, name, status, label,  toggleOn }) => Box({
    connections: [[
        connection.service,
        w => w.toggleClassName('active', connection.callback()),
    ]],
    className: 'quicksettings__button',
    children: [
        Button({
            hexpand: true,
            className: 'toggle',
            onClicked: toggle,
            child: Box({
                children: [
                    icon,
                    Box({
                        vertical: true,
                        valign: 'center',
                        children: [
                            Label({
                                className: 'text__bold',
                                halign: 'start',
                                label,
                            }),
                            status({ halign: 'start' }),
                        ],
                    }),
                ],
            }),
        }),
        Arrow(name, toggleOn),
    ],
});

const RevealerMenu = (name, child) => Box({
    children: [Revealer({
        transition: 'slide_down',
        connections: [[QSMenu, r => r.reveal_child = name === QSMenu.opened]],
        child,
    })],
});

const NetworkToggle = () => ArrowToggle({
    icon: network.WifiIndicator(),
    label: 'Internet',
    status: network.SSIDLabel,
    connection: {
        service: Network,
        callback: () => Network.wifi?.enabled,
    },
    toggle: Network.toggleWifi,
    toggleOn: () => {
        Network.wifi.enabled = true;
        Network.wifi.scan();
    },
    name: 'network',
});

const BluetoothToggle = () => ArrowToggle({
    icon: bluetooth.Indicator(),
    label: 'Bluetooth',
    status: bluetooth.ConnectedLabel,
    connection: {
        service: Bluetooth,
        callback: () => Bluetooth.enabled,
    },
    toggle: () => Bluetooth.enabled = !Bluetooth.enabled,
    toggleOn: () => {
        Bluetooth.enabled = QSMenu.opened === 'bluetooth'
            ? true : Bluetooth.enabled;
    },
    name: 'bluetooth',
});

const DNDToggle = () => SmallToggle({
    icon: notifications.DNDIndicator(),
    label: 'Notifications',
    status: notifications.DNDStatus,
    toggle: notifications.DNDToggle,
});

const MuteToggle = () => SmallToggle({
    icon: audio.MicrophoneMuteIndicator(),
    label: 'Microphone',
    status: audio.MicrophoneStatus,
    toggle: audio.MicrophoneMuteToggle,
});


const Submenu = ({ menuName, icon, title, contentType }) => RevealerMenu(menuName, Box({
    vertical: true,
    className: `submenu ${menuName}`,
    children: [
        Box({ className: 'title', children: [icon, Label(title)] }),
        contentType({ className: 'content', hexpand: true }),
    ],
}));

const NetworkSelection = () => Submenu({
    menuName: 'network',
    icon: Icon('network-wireless-symbolic'),
    title: 'Wireless Networks',
    contentType: network.WifiSelection,
});

const BluetoothSelection = () => Submenu({
    menuName: 'bluetooth',
    icon: Icon('bluetooth-symbolic'),
    title: 'Bluetooth',
    contentType: bluetooth.Devices,
});

const VolumeBox = () => Box({
    vertical: true,
    className: 'volume-box',
    children: [
        Box({
            className: 'volume',
            children: [
                Button({
                    child: audio.SpeakerTypeIndicator(),
                    onClicked: 'pactl set-sink-mute @DEFAULT_SINK@ toggle',
                }),
                audio.SpeakerSlider({ hexpand: true }),
                Arrow('stream-selector'),
            ],
        }),
        RevealerMenu('stream-selector', Box({
            vertical: true,
            className: 'menu',
            children: [
                Button({
                    className: 'settings__button',
                    hexpand: false,
                    onClicked: () => {
                        execAsync('pavucontrol').catch(print);
                        App.closeWindow('controlcenter');
                    },
                    child: Label({
                        hexpand: false,
                        label: 'Settings',
                        xalign: 0,
                    }),
                }),
                audio.StreamSelector(),
                Separator(),
            ],
        })),
    ],
});

const BrightnessBox = () => Box({
    className: 'brightness',
    children: [
        Button({
            onClicked: () => {
                execAsync('wl-gammactl').catch(print);
                App.closeWindow('controlcenter');
            },
            child: brightness.Indicator(),
        }),
        brightness.BrightnessSlider(),
        Button({
            onClicked: () => {
                execAsync('wl-gammactl').catch(print);
                App.closeWindow('controlcenter');
            },
            child: Icon({
                icon: 'pan-end-symbolic',
            }),
        }),
    ],
});

export const QuicksettingsContainer = () => Box({
    vertical: true,
    hexpand: false,
    className: 'quicksettings__container',
    children:
        [
            Box({
                children: [
                    NetworkToggle(),
                    Separator(),
                    BluetoothToggle(),
                ],
            }),
            NetworkSelection(),
            BluetoothSelection(),
            Separator(),
            Box({
                children: [
                    DNDToggle(),
                    Separator(),
                    MuteToggle(),
                ],
            }),
            Separator(),
            VolumeBox(),
            Separator(),
            BrightnessBox(),
            media.PopupContent(),
        ],
});
