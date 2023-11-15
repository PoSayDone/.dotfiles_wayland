import icons from '../icons.js';
import PopupWindow from '../misc/PopupWindow.js';
import { Utils, Widget, App, Variable } from '../imports.js';

export const opened = Variable('');
App.connect('window-toggled', (_, name, visible) => {
    if (name === 'quicksettings' && !visible)
        Utils.timeout(500, () => opened.value = '');
});

export const Arrow = name => Widget.Button({
    class_name: 'arrow',
    child: Widget.Icon({
        icon: icons.ui.arrow.right,
    }),
    on_clicked: () => App.toggleWindow(name),
});

export const ArrowToggleButton = ({
    name, icon, label, status, activate, deactivate,
    activateOnArrow = true,
    connection: [service, condition],
}) => Widget.Box({
    class_name: 'quicksettings__button',
    connections: [[service, box => {
        box.toggleClassName('active', condition());
    }]],
    children: [
        Widget.Button({
            child: Widget.Box({
                hexpand: true,
                children: [
                    icon,
                    Widget.Box({
                        hpack: 'start',
                        vpack: 'center',
                        vertical: true,
                        children: [label, status],
                    }),
                ],
            }),
            on_clicked: () => {
                if (condition()) {
                    deactivate();
                    if (opened.value === name)
                        opened.value = '';
                } else {
                    activate();
                }
            },
        }),
        Arrow(name, activateOnArrow && activate),
    ],
});

export const SimpleToggleButton = ({
    icon, label, status, toggle,
    connection: [service, condition],
}) => Widget.Box({
    class_name: 'quicksettings__button',
    connections: [[service, box => {
        box.toggleClassName('active', condition());
    }]],
    children: [
        Widget.Button({
            child: Widget.Box({
                hexpand: true,
                children: [icon, Widget.Box({ hpack: 'start', vpack: 'center', vertical: true, children: [label, status] })],
            }),
            on_clicked: () => toggle(),
        }),
    ],
});

export const Menu = ({ name, icon, title, menu_content }) => PopupWindow({
    name: name,
    layout: 'center',
    hexpand: true,
    vexpand: true,
    content: Widget.Box({
        class_names: ['menu', name],
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'title horizontal',
                children: [icon, title],
            }),
            Widget.Separator(),
            ...menu_content,
        ],
    }),
});
