import { Widget, Variable } from '../../imports.js';
import App from 'resource:///com/github/Aylur/ags/app.js';

const weather = Variable({}, {
    poll: [30000, `python ${App.configDir}/bin/weather`, out => JSON.parse(out)],
});

export const Weather = () => Widget.Label({
    class_name: 'weather',
    binds: [
        ['label', weather, 'value', value => value.text || '󰇘'],
        ['tooltip-text', weather, 'value', value => value.tooltip || '󰇘'],
    ],
});
