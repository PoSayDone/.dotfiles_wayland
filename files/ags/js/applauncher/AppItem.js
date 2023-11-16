import { lookUpIcon } from 'resource:///com/github/Aylur/ags/utils.js';
import HoverableButton from '../misc/HoverableButton.js';
import { Widget, App } from '../imports.js';

/** @param {import('resource:///com/github/Aylur/ags/service/applications.js').Application} app */
export default app => {
    const title = Widget.Label({
        class_name: 'title',
        label: app.name,
        xalign: 0,
        vpack: 'center',
        truncate: 'end',
    });

    const description = Widget.Label({
        class_name: 'description',
        label: app.description || '',
        wrap: true,
        xalign: 0,
        justification: 'left',
        vpack: 'center',
    });

    const icon = Widget.Icon({
        icon: lookUpIcon(app.icon_name || '') ? app.icon_name || '' : '',
        size: 32,
    });

    const textBox = Widget.Box({
        vertical: true,
        vpack: 'center',
        children: app.description ? [title, description] : [title],
    });

    return HoverableButton({
        class_name: 'app-item',
        setup: self => self.app = app,
        on_clicked: () => {
            App.closeWindow('applauncher');
            app.launch();
        },
        child: Widget.Box({
            children: [icon, textBox],
        }),
    });
};
