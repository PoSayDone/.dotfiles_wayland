const { GLib } = imports.gi;
const { Notifications } = ags.Service;
const { lookUpIcon } = ags.Utils;
const { Widget } = ags;
const { timeout } = ags.Utils;

const createIconWidget = ({ appEntry, appIcon, image }) => {
    if (image) {
        return {
            type: 'box',
            className: 'icon',
            style: `
                background-image: url("${image}");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                min-width: 30px;
                min-height: 30px;
            `,
        };
    }

    let icon = 'dialog-information-symbolic';
    if (lookUpIcon(appIcon))
        icon = appIcon;

    if (lookUpIcon(appEntry))
        icon = appEntry;

    return {
        type: 'box',
        className: 'icon',
        style: `
            min-width: 30px;
            min-height: 30px;
        `,
        children: [{
            type: 'icon', icon, size: 30,
            halign: 'center', hexpand: true,
            valign: 'center', vexpand: true,
        }],
    };
};


const createNotification = ({ id, summary, body, actions, urgency, ...icon }) => {
    const child = {
        type: 'box',
        orientation: 'vertical',
        className: 'notification',
        children: [
            {
                type: 'box',
                orientation: 'horizontal',
                children: [
                    createIconWidget(icon),
                    {
                        type: 'box',
                        children: [
                            {
                                type: 'box',
                                hexpand: true,
                                orientation: 'vertical',
                                children: [
                                    {
                                        type: 'box',
                                        children: [
                                            {
                                                className: 'title',
                                                xalign: 0,
                                                justify: 'left',
                                                hexpand: true,
                                                type: 'label',
                                                maxWidth: 24,
                                                wrap: true,
                                                label: summary.length > 55 ? summary.substring(0, 55) + "..." : summary,
                                            },
                                        ],
                                    },
                                    {
                                        className: 'description',
                                        hexpand: true,
                                        markup: true,
                                        xalign: 0,
                                        justify: 'left',
                                        type: 'label',
                                        label: body.length > 140 ? body.substring(0, 140) + "..." : body,
                                        wrap: true,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'box',
                        hexpand: true,
                        halign: 'end',
                        valign: 'start',
                        children: [
                            {
                                className: 'close-button',
                                type: 'button',
                                valign: 'end',
                                child: Widget({ type: 'icon', icon: 'window-close-symbolic' }),
                                onClick: () => Notifications.close(id),
                            },
                        ]
                    }
                ]
            },
            {
                type: 'box',
                className: 'actions',
                children: actions.map(({ action, label }) => ({
                    className: 'action-button',
                    type: 'button',
                    onClick: () => Notifications.invoke(id, action),
                    hexpand: true,
                    child: label,
                })),
            },
        ],
    };

    return Widget({
        type: 'eventbox',
        className: `notifications__container ${urgency}`,
        onClick: () => Notifications.dismiss(id),
        child: child,
    });
};

const createNotificationList = (map, { notification = createNotification, ...rest }) => Widget({
    ...rest,
    type: 'box',
    orientation: 'vertical',
    connections: [[Notifications, box => {
        box.get_children().forEach(ch => ch.destroy());
        const notifications = [...Notifications[map]].map(([id, n]) => ({ id, ...n }));
        notifications.reverse();
        for (const n of notifications)
            box.add(notification(n));
        box.show_all();
    }]],
});

Widget.widgets['notifications/popup-list'] = props => createNotificationList('popups', props);

Widget.widgets['notifications/popups'] = ({ transition }) => Widget({
    type: 'box',
    style: 'padding: 1px;',
    children: [{
        type: 'revealer',
        transition,
        style: 'border: 1px solid red; padding: 5px;',
        connections: [[Notifications, revealer => {
            revealer.reveal_child = Notifications.popups.size > 0;
        }]],
        child: {
            type: 'notifications/popup-list',
            className: 'notification-popup',
        },
    }],
});


Widget.widgets['notifications/header'] = props => Widget({
    ...props,
    type: 'box',
    vexpand: true,
    children: [
        { type: 'label', label: 'Notifications', hexpand: true, xalign: 0 },
        {
            type: 'notifications/clear-button',
            child: {
                type: 'box',
                children: [
                    'Clear ',
                    {
                        type: 'dynamic',
                        items: [
                            { value: true, widget: { type: 'icon', icon: 'user-trash-full-symbolic' } },
                            { value: false, widget: { type: 'icon', icon: 'user-trash-symbolic' } },
                        ],
                        connections: [
                            [Notifications, dynamic => dynamic.update(value => {
                                return value === Notifications.notifications.size > 0;
                            })],
                        ],
                    },
                ],
            },
        },
    ],
});

Widget.widgets['notifications/popup-content'] = () => Widget({
    type: 'box',
    className: 'notifications',
    vexpand: true,
    orientation: 'vertical',
    children: [
        {
            type: 'notifications/header',
            className: 'header',
        },
        {
            type: 'box',
            vexpand: true,
            children: [{
                type: 'notifications/list',
                className: 'notification-list',
            }],
        },
    ],
});

Widget.widgets['notifications/indicator'] = props => Widget({
    ...props,
    type: 'notifications/dnd-indicator',
    connections: [[Notifications, indicator => {
        const notified = Notifications.notifications.size > 0;
        indicator.toggleClassName('notified', notified);
        indicator.visible = notified || Notifications.dnd;
    }]],
});

Widget.widgets['notifications/popup-label'] = ({ transition = 'slide_left', ...props }) => Widget({
    ...props,
    type: 'box',
    children: [{
        type: 'revealer',
        transition,
        connections: [[Notifications, revaler => {
            revaler.reveal_child = Notifications.popups.size > 0;
        }]],
        child: {
            type: 'label',
            connections: [[Notifications, label => {
                const lbl = Array.from(Notifications.notifications.values()).pop()?.summary;
                label.label = lbl || '';
            }]],
        },
    }],
});

Widget.widgets['notifications/popup-indicator'] = ({ direction = 'left', ...props }) => Widget({
    ...props,
    type: 'box',
    children: [{
        type: 'eventbox',
        onHover: box => {
            timeout(200, () => box._revealed = true);
            box.get_child().get_children()[direction === 'left' ? 0 : 1].get_children()[0].reveal_child = true;
        },
        onHoverLost: box => {
            if (!box._revealed)
                return;

            timeout(200, () => box._revealed = false);
            box.get_child().get_children()[direction === 'left' ? 0 : 1].get_children()[0].reveal_child = false;
        },
        child: {
            type: 'box',
            children: direction === 'left'
                ? [
                    { type: 'notifications/popup-label', transition: 'slide_left' },
                    { type: 'notifications/indicator' },
                ]
                : [
                    { type: 'notifications/indicator' },
                    { type: 'notifications/popup-label', transition: 'slide_right' },
                ],
        },
    }],
});


Widget.widgets['notifications/notification-list'] = props => createNotificationList('notifications', props);

Widget.widgets['notifications/placeholder'] = props => Widget({
    ...props,
    type: 'box',
    connections: [
        [Notifications, box => box.visible = Notifications.notifications.size === 0],
    ],
});

Widget.widgets['notifications/clear-button'] = props => Widget({
    ...props,
    type: 'button',
    onClick: Notifications.clear,
});

Widget.widgets['notifications/dnd-indicator'] = ({
    silent = Widget({ type: 'icon', icon: 'notifications-disabled-symbolic' }),
    noisy = Widget({ type: 'icon', icon: 'preferences-system-notifications-symbolic' }),
    ...rest
}) => Widget({
    ...rest,
    type: 'dynamic',
    items: [
        { value: true, widget: silent },
        { value: false, widget: noisy },
    ],
    connections: [[Notifications, dynamic => {
        dynamic.update(value => value === Notifications.dnd);
    }]],
});

Widget.widgets['notifications/dnd-toggle'] = props => Widget({
    ...props,
    type: 'button',
    onClick: () => { Notifications.dnd = !Notifications.dnd; },
    connections: [[Notifications, button => {
        button.toggleClassName('on', !Notifications.dnd);
    }]],
});

Widget.widgets['notifications/status-label'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[Notifications, label => label.label = (!Notifications.dnd ? "On" : "Off")]],
});

Widget.widgets['notifications/list'] = props => Widget({
    ...props,
    hscroll: 'never',
    vscroll: 'automatic',
    type: 'scrollable',
    className: 'notifications-center__list',
    child: {
        type: 'box',
        orientation: 'vertical',
        vexpand: true,
        children: [
            { type: 'notifications/notification-list' },
            {
                type: 'notifications/placeholder',
                className: 'placeholder',
                orientation: 'vertical',
                valign: 'center',
                vexpand: true,
                children: [
                    { type: 'label', label: '󰂛', className: 'icon' },
                    'Your inbox is empty',
                ],
            },
        ],
    },
});

Widget.widgets['notifications/notifications-indicator'] = props => Widget({
    ...props,
    type: 'box',
    className: 'notifications-indicator',
    children: [
        {
            type: 'notifications/popup-indicator',
            className: 'indicator',
            direction: 'right',
        },
    ],
    connections: [[Notifications, box => {
        box.visible = Notifications.notifications.size > 0;
    }]],
});
