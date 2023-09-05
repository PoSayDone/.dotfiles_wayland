// in config.js
const { CONFIG_DIR, exec } = ags.Utils;
import { bar } from './windows';

exec(`sassc ${CONFIG_DIR}/scss/main.scss ${CONFIG_DIR}/style.css`);

const monitors = ags.Service.Hyprland.HyprctlGet('monitors')
    .map(mon => mon.id);

export default {
    closeWindowDelay: {
        'quicksettings': 300,
        'dashboard': 300,
    },
    style: `${CONFIG_DIR}/style.css`,
    notificationPopupTimeout: 5000, // milliseconds
    windows: [
        bar,
    ],
};
