import { separator } from '../modules/separator.js';

const { Service, App } = ags;
const { Network, Bluetooth } = ags.Service;
const { runCmd, timeout } = ags.Utils;

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

const arrow = (menu, toggleOn) => ({
    type: 'button',
    className: 'arrow',
    onClick: () => {
        QSMenu.toggle(menu);
        if (toggleOn)
            toggleOn();
    },
    connections: [[QSMenu, button => {
        button.toggleClassName('opened', QSMenu.opened === menu);
    }]],
    child: {
        type: 'icon', icon: 'pan-end-symbolic',
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
    },
});

const arrowToggle = ({ icon, label, connection, status, toggle, name, toggleOn }) => ({
    type: 'box',
    connections: [[
        connection[0],
        w => w.toggleClassName('active', connection[1]()),
    ]],
    className: 'quicksettings__button',
    children: [
        {
            type: 'button',
            valign: 'center',
            hexpand: true,
            onClick: toggle,
            child: {
                type: 'box',
                children: [
                    {
                        type: 'box',
                        className: 'quicksettings__button_icon',
                        orientation: 'horizontal',
                        children: [
                            { type: icon },
                        ],
                    },
                    {
                        type: 'box',
                        vertical: true,
                        hexpand: false,
                        children: [
                            {
                                type: label,
                                className: 'text__bold',
                                halign: 'center',
                            },
                            {
                                type: status,
                                halign: 'center',
                            },
                        ],
                    },
                ],
            },
        },
        arrow(name, toggleOn),
    ],
});

const toggle = ({ icon, label, toggle, status }) => ({
    type: toggle,
    className: 'quicksettings__button',
    child: {
        type: 'box',
        orientation: 'horizontal',
        valign: 'center',
        children: [
            {
                type: 'button',
                valign: 'center',
                hexpand: true,
                child: {
                    type: 'box',
                    children: [
                        {
                            type: 'box',
                            className: 'quicksettings__button_icon',
                            orientation: 'horizontal',
                            children: [
                                { type: icon },
                            ],
                        },
                        {
                            type: 'box',
                            orientation: 'vertical',
                            hexpand: false,
                            children: [
                                {
                                    type: label,
                                    className: 'text__bold',
                                    halign: 'start',
                                },
                                {
                                    type: status,
                                    halign: 'start',
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },

});

const slider = ({ icon, slider, arrowCmd }) => ({
    type: 'box',
    className: 'slider-box',
    children: [
        { type: icon, className: 'icon' },
        { type: slider, hexpand: true },
        {
            type: 'button',
            onClick: () => runCmd(arrowCmd),
            child: {
                type: 'icon',
                icon: 'pan-end-symbolic',
            },
        },
    ],
});

const menu = (name, child) => ({
    type: 'box',
    children: [{
        type: 'revealer',
        transition: 'slide_down',
        connections: [[QSMenu, r => r.reveal_child = name === QSMenu.opened]],
        child,
    }],
});


const submenu = ({ menuName, icon, title, contentType }) => menu(menuName, {
    type: 'box',
    orientation: 'vertical',
    className: `submenu ${menuName}`,
    children: [
        { className: 'title', type: 'box', children: [icon, title], hexpand: false },
        { className: 'content', type: contentType, hexpand: true },
    ],
});

const networkSelection = submenu({
    menuName: 'network',
    icon: { type: 'icon', icon: 'network-wireless-symbolic' },
    title: 'Wireless Networks',
    contentType: 'network/wifi-selection',
});

const bluetoothSelection = submenu({
    menuName: 'bluetooth',
    icon: { type: 'icon', icon: 'bluetooth-symbolic' },
    title: 'Bluetooth',
    contentType: 'bluetooth/devices',
});

const networkToggle = arrowToggle({
    icon: 'network/wifi-indicator',
    label: 'network/ssid-label',
    status: 'network/wifi-status-label',
    connection: [Network, () => Network.wifi?.enabled],
    toggle: Network.toggleWifi,
    toggleOn: () => {
        Network.wifi.enabled = true;
        Network.wifi.scan();
    },
    name: 'network',
});

const bluetoothToggle = arrowToggle({
    icon: 'bluetooth/indicator',
    label: 'bluetooth/label',
    status: 'bluetooth/status-label',
    connection: [Bluetooth, () => Bluetooth.enabled],
    toggle: () => Bluetooth.enabled = !Bluetooth.enabled,
    toggleOn: () => {
        Bluetooth.enabled = QSMenu.opened === 'bluetooth'
            ? true : Bluetooth.enabled;
    },
    name: 'bluetooth',
});

const notificationsToggle = toggle({
    toggle: 'notifications/dnd-toggle',
    icon: 'notifications/dnd-indicator',
    label: 'notifications/label',
    status: 'notifications/status-label',
});

const muteToggle = toggle({
    toggle: 'audio/microphone-mute-toggle',
    icon: 'audio/microphone-mute-indicator',
    label: 'audio/microphone-mute-label',
    status: 'audio/microphone-mute-status-label',
});

export const quicksettingsContainer = {
    type: 'box',
    orientation: 'vertical',
    hexpand: false,
    className: 'quicksettings__container',
    children:
        [
            {
                type: 'box',
                children: [
                    networkToggle,
                    separator,
                    bluetoothToggle,
                ],
            },
            networkSelection,
            bluetoothSelection,
            separator,
            {
                type: 'box',
                children: [
                    notificationsToggle,
                    separator,
                    muteToggle,
                ],
            },
            separator,
            {
                type: 'box',
                children: [
                    {
                        type: 'media/popup-content',
                        className: 'media',
                        orientation: 'vertical',
                        hexpand: true,
                    },
                ],
            },
            separator,
            {
                type: 'box',
                orientation: 'vertical',
                className: 'sliders',
                children: [
                    slider({
                        icon: 'audio/speaker-indicator',
                        slider: 'audio/speaker-slider',
                        arrowCmd: 'pavucontrol',
                    }),
                    separator,
                    slider({
                        icon: 'brightness/icon',
                        slider: 'brightness/slider',
                        arrowCmd: 'wl-gammactl',
                    }),
                ],
            },
        ],
};
