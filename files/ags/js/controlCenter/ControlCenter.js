import PopupWindow from '../misc/PopupWindow.js';
import Separator from '../misc/Separator.js';
import NotificationsColumn from './NotificationsColumn.js';
import Microphone from './widgets/Microphone.js';
import DND from './widgets/DND.js';
import Media from './widgets/Media.js';
import Brightness from './widgets/Brightness.js';
import Header from './widgets/Header.js';

import { Widget } from '../imports.js';
import { Volume } from './widgets/Volume.js';
import { NetworkToggle } from './widgets/Network.js';
import { BluetoothToggle } from './widgets/Bluetooth.js';

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
    layout: 'top',
    content: Widget.Box({
        class_name: 'controlcenter__container',
        children: [
            Widget.Box({
                vertical: true,
                children: [
                    Row(
                        [NetworkToggle(), Separator(), BluetoothToggle()],
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
                            ),
                            Separator(),
                            Row(
                                [Brightness()],
                            ),
                        ],
                    })]),
                    Media(),
                    Separator(),
                    Widget.Box({
                        vexpand: true,
                    }),
                    Header(),
                ],
            }),
            NotificationsColumn(),
        ],
    }),
});
