import HoverRevealer from '../../misc/HoverRevealer.js';
import Indicator from '../../services/onScreenIndicator.js';
import icons from '../../icons.js';
import SysTray from './SysTray.js';
import HoverableButton from '../../misc/HoverableButton.js';
import { Widget, Audio, Network, Bluetooth, App, Notifications } from '../../imports.js';

const MicrophoneIndicator = () => Widget.Icon({
    connections: [[Audio, icon => {
        if (!Audio.microphone)
            return;

        const { muted, low, medium, high } = icons.audio.mic;
        if (Audio.microphone.is_muted)
            return icon.icon = muted;

        /** @type {Array<[number, string]>} */
        const cons = [[67, high], [34, medium], [1, low], [0, muted]];
        icon.icon = cons.find(([n]) => n <= Audio.microphone.volume * 100)?.[1] || '';

        icon.visible = Audio.recorders.length > 0 || Audio.microphone.is_muted;
    }]],
});

const DNDIndicator = () => Widget.Icon({
    icon: icons.notifications.silent,
    binds: [['visible', Notifications, 'dnd']],
});

const BluetoothDevicesIndicator = () => Widget.Box({
    class_name: 'bluetooth__devices',
    connections: [[Bluetooth, box => {
        box.children = Bluetooth.connectedDevices
            .map(({ iconName, name }) => HoverRevealer({
                class_name: 'bluetooth__device',
                indicator: Widget.Icon(iconName + '-symbolic'),
                child: Widget.Label(name),
            }));

        box.visible = Bluetooth.connectedDevices.length > 0;
    }, 'notify::connected-devices']],
});

const BluetoothIndicator = () => Widget.Icon({
    class_name: 'bluetooth',
    icon: icons.bluetooth.enabled,
    binds: [['visible', Bluetooth, 'enabled']],
});

const NetworkIndicator = () => Widget.Icon({
    connections: [[Network, self => {
        const icon = Network[Network.primary || 'wifi']?.iconName;
        self.icon = icon || '';
        self.visible = icon;
    }]],
});

const AudioIndicator = () => Widget.Icon({
    connections: [[Audio, icon => {
        if (!Audio.speaker)
            return;

        const { muted, low, medium, high, overamplified } = icons.audio.volume;
        if (Audio.speaker.is_muted)
            return icon.icon = muted;


        /** @type {Array<[number, string]>} */
        const cons = [[101, overamplified], [67, high], [34, medium], [1, low], [0, muted]];
        icon.icon = cons.find(([n]) => n <= Audio.speaker.volume * 100)?.[1] || '';
    }, 'speaker-changed']],
});

export default () => HoverableButton({
    class_name: 'bar__controlcenter_container',
    onClicked: () => App.toggleWindow('controlcenter'),
    onScrollUp: () => {
        Audio.speaker.volume += 0.02;
        Indicator.speaker();
    },
    onScrollDown: () => {
        Audio.speaker.volume -= 0.02;
        Indicator.speaker();
    },
    child: Widget.Box({
        class_name: 'bar__controlcenter',
        children: [
            DNDIndicator(),
            BluetoothDevicesIndicator(),
            BluetoothIndicator(),
            NetworkIndicator(),
            AudioIndicator(),
            MicrophoneIndicator(),
            SysTray(),
        ],
    }),
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'controlcenter' && visible);
    }]],
});
