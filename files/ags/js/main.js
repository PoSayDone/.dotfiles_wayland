import { USER } from 'resource:///com/github/Aylur/ags/utils.js';
import Bar from './bar/Bar.js';
import Notifications from './notifications/Notifications.js';
import ControlCenter from './controlCenter/ControlCenter.js';
import Applauncher from './applauncher/Applauncher.js';
import OSD from './osd/OSD.js';

import * as setup from './utils.js';
import { forMonitors } from './utils.js';
import Calendar from './calendar/Calendar.js';
import { BluetoothDevices } from './controlCenter/widgets/Bluetooth.js';
import { WifiSelection } from './controlCenter/widgets/Network.js';
import { AppMixer } from './controlCenter/widgets/Volume.js';
import { SinkSelector } from './controlCenter/widgets/Volume.js';

setup.warnOnLowBattery();
setup.reloadCss();
setup.globalServices();

const windows = () => [
    forMonitors(Bar),
    forMonitors(Notifications),
    forMonitors(OSD),
    ControlCenter(),
    Applauncher(),
    Calendar(),
    BluetoothDevices(),
    WifiSelection(),
    AppMixer(),
    SinkSelector(),
];

export default {
    windows: windows().flat(2),
    maxStreamVolume: 1.5,
    cacheNotificationActions: true,
    closeWindowDelay: {
        'quicksettings': 300,
        'dashboard': 300,
    },
    style: `/home/${USER}/.config/ags/style.css`,
    notificationPopupTimeout: 5000, // milliseconds
};
