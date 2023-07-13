var notificationsCenterContainer = {
    type: 'box',
    className: 'notifications-center',
    orientation: 'vertical',
    children: [
        {
            type: 'box',
            orientation: 'horizontal',
            className: 'notifications-center__header',
            hexpand: true,
            children: [
                {
                    type: 'notifications/dnd-toggle',
                    className: 'notifications-center__header_dnd-button',
                    halign: 'start',
                    child: {
                        hexpand: true,
                        halign: 'center',
                        type: 'notifications/dnd-indicator',
                    }
                },
                {
                    type: 'notifications/clear-button',
                    className: 'notifications-center__header_clear-button',
                    hexpand: true,
                    halign: 'end',
                    child: {
                        type: 'label',
                        label: 'Clear all'
                    }
                }
            ]
        },
        { type: 'notifications/list' },
    ]
}