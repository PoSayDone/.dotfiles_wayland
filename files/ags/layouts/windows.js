import { BarContainer } from '../modules/bar.js';
import { PopupLayout } from '../modules/popuplayout.js';

import * as quicksettings from '../modules/quicksettings.js';
import * as notifications from '../modules/notifications.js';
import { OnScreenIndicator } from '../modules/onscreenindicator.js';

const { Window, Box, Scrollable, Label } = ags.Widget;

export const Bar = monitor => Window({
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusive: true,
    monitor,
    hexpand: true,
    child: BarContainer(),
});

export const Controlcenter = () => Window({
    name: 'controlcenter',
    popup: true,
    focusable: true,
    anchor: 'top',
    child: PopupLayout({
        layout: 'top',
        window: 'controlcenter',
        child: Box({
            className: 'controlcenter__container',
            children: [
                quicksettings.QuicksettingsContainer(),
                Box({
                    className: 'notifications--list',
                    vertical: true,
                    children: [
                        Box({
                            className: 'notifications__header',
                            children: [
                                Label({
                                    hexpand: true,
                                    halign: 'start',
                                    valign: 'center',
                                    label: 'Notifications',
                                    className: 'notifications__title',
                                }),
                                notifications.ClearButton({
                                    className: 'notifications__clear-button',
                                })],
                        }),
                        Scrollable({
                            hexpand: true,
                            hscroll: 'never',
                            vscroll: 'automatic',
                            child: Box({
                                vertical: true,
                                children: [
                                    notifications.NotificationList(),
                                    notifications.Placeholder(),
                                ],
                            }),
                        }),
                    ],
                }),
            ],
        }),
    }),
});

export const Notifications = monitor => Window({
    monitor,
    layer: 'overlay',
    name: `notifications${monitor}`,
    anchor: 'top',
    child: notifications.PopupList('slide_down'),
});

export const Indicator = monitor => Window({
    layer: 'overlay',
    monitor,
    name: `onscreenindicator${monitor}`,
    anchor: 'left',
    child: OnScreenIndicator('slide_down'),
});
