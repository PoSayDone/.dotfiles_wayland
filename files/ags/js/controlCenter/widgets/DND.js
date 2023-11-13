import icons from '../../icons.js';
import { SimpleToggleButton } from '../ToggleButton.js';
import { Notifications, Widget } from '../../imports.js';

export default () => SimpleToggleButton({
    icon: Widget.Icon({
        connections: [[Notifications, icon => {
            icon.icon = Notifications.dnd
                ? icons.notifications.silent
                : icons.notifications.noisy;
        }, 'notify::dnd']],
    }),
    label: Widget.Label({
        class_name: 'title',
        hpack: 'start',
        label: 'Notifications',
    }),
    status: Widget.Label({
        hpack: 'start',
        connections: [[Notifications, label => {
            label.label = !Notifications.dnd
                ? 'Enabled'
                : 'Disabled';
        }]],
    }),
    toggle: () => Notifications.dnd = !Notifications.dnd,
    connection: [Notifications, () => !Notifications.dnd],
});
