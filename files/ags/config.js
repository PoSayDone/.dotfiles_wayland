// in config.js
import { USER, exec } from 'resource:///com/github/Aylur/ags/utils.js';
import { Bar, Notifications, Indicator, Controlcenter } from './layouts/windows.js';

exec(`sassc /home/${USER}/.config/ags/styles/main.scss /home/${USER}/.config/ags/style.css`);

const monitors = ags.Service.Hyprland.HyprctlGet('monitors');

export default {
    closeWindowDelay: {
        'quicksettings': 300,
        'dashboard': 300,
    },
    style: `/home/${USER}/.config/ags/style.css`,
    notificationPopupTimeout: 5000, // milliseconds
    windows: [
        ...monitors.map(element => [
            Bar(element.id),
            Notifications(element.id),
            Indicator(element.id),
        ]),
        Controlcenter(),
    ],
};
