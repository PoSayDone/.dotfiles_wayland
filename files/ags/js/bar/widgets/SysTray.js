import { SystemTray, Widget } from '../../imports.js';
import Gdk from 'gi://Gdk';

const SysTrayItem = item => Widget.Button({
    binds: [['tooltipMarkup', item, 'tooltip-markup']],
    child: Widget.Icon({ binds: [['icon', item, 'icon']] }),
    setup: btn => {
        const id = item.menu.connect('popped-up', menu => {
            btn.toggleClassName('active');
            menu.connect('notify::visible', menu => {
                btn.toggleClassName('active', menu.visible);
            });
            menu.disconnect(id);
        });
    },
    onPrimaryClick: btn =>
        item.menu.popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
    onSecondaryClick: btn =>
        item.menu.popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
});

export default () => Widget.Box({
    class_name: 'tray',
    binds: [['children', SystemTray, 'items', i => i.map(SysTrayItem)]],
});
