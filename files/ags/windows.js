const { Window, CenterBox, Box, Button } = ags.Widget;
import { barContainer } from './widgets/bar.js';
import { quicksettingsContainer } from './widgets/quicksettings.js';

export const indicator = ({ monitor }) => ({
    monitor,
    name: `indicator${monitor}`,
    className: 'indicator',
    layer: 'overlay',
    anchor: ['left'],
    child: { type: 'on-screen-indicator' },
});

// export const Bar = ({ monitor }) => Window({
//     name: `bar${monitor}`,
//     exclusive: true,
//     monitor,
//     anchor: ['top', 'left', 'right'],
//     child: barContainer,
// });
//
export const Bar = ({ start, center, end, anchor, monitor }) => Window({
    name: `bar${monitor}`,
    exclusive: true,
    monitor,
    anchor,
    child: CenterBox({
        className: 'panel',
        startWidget: Box({ children: start, className: 'start' }),
        centerWidget: Box({ children: center, className: 'center' }),
        endWidget: Box({ children: end, className: 'end' }),
    }),
});

export const createNotifications = ({ monitor }) => {
    return {
        name: `notifications${monitor}`,
        monitor: monitor,
        anchor: ['top'],
        margin: [12, 0],
        layer: 'overlay',
        child: { type: 'notifications/popups', transition: 'slide_down' },
    };
};

export const quicksettings = {
    name: 'quicksettings',
    popup: true,
    anchor: ['top', 'right', 'bottom', 'left'],
    child: {
        type: 'layout',
        layout: 'topright',
        window: 'quicksettings',
        child: quicksettingsContainer,
    },
};

// export const notificationsCenter = {
//     name: 'notificationsCenter',
//     popup: true,
//     anchor: ['top', 'right', 'bottom', 'left'],
//     child: {
//         type: 'layout',
//         layout: 'top',
//         window: 'notificationsCenter',
//         child: imports.widgets.notificationsCenter.notificationsCenterContainer,
//     },
// };
