// in config.js
const { CONFIG_DIR, exec } = ags.Utils;
const { windows } = imports.windows;

exec(`sassc ${CONFIG_DIR}/scss/main.scss ${CONFIG_DIR}/style.css`);

Object.keys(imports.widgets).forEach(m => imports.widgets[m]);
Object.keys(imports.modules).forEach(m => imports.modules[m]);

var config = {
    exitOnError: false,
    notificationPopupTimeout: 5000, // milliseconds
    stackTraceOnError: false,
    style: `${CONFIG_DIR}/style.css`,
    windows: [
        ...windows,
    ],
};
