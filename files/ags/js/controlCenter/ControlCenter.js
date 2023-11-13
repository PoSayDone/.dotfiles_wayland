import PopupWindow from '../misc/PopupWindow.js';
import Separator from '../misc/Separator.js';
import NotificationsColumn from './NotificationsColumn.js';
import Microphone from './widgets/Microphone.js';
import DND from './widgets/DND.js';
import Media from './widgets/Media.js';
import Brightness from './widgets/Brightness.js';
import Header from './widgets/Header.js';

import { Widget } from '../imports.js';
import { Volume, SinkSelector, AppMixer } from './widgets/Volume.js';
import { NetworkToggle, WifiSelection } from './widgets/Network.js';
import { BluetoothToggle, BluetoothDevices } from './widgets/Bluetooth.js';

const Row = (toggles, menus = []) => Widget.Box({
    class_name: 'row',
    vertical: true,
    children: [
        Widget.Box({
            children: toggles,
        }),
        ...menus,
    ],
});

export default () => PopupWindow({
    name: 'controlcenter',
    anchor: ['top', 'right'],
    layout: 'none',
    content: Widget.Box({
        class_name: 'controlcenter__container',
        children: [
            Widget.Box({
                vertical: true,
                children: [
                    Header(),
                    Separator(),
                    Row(
                        [NetworkToggle(), Separator(), BluetoothToggle()],
                        [WifiSelection(), BluetoothDevices()],
                    ),
                    Separator(),
                    Row(
                        [Microphone(), Separator(), DND()],
                    ),
                    Separator(),
                    Row([Widget.Box({
                        class_name: 'slider-box',
                        vertical: true,
                        children: [
                            Row(
                                [Volume()],
                                [SinkSelector(), AppMixer()],
                            ),
                            Separator(),
                            Row(
                                [Brightness()],
                            ),
                        ],
                    })]),
                    Media(),
                ],
            }),
            NotificationsColumn(),
        ],
    }),
});
