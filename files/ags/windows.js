const { Hyprland } = ags.Service;

var windows = [];
const monitors = Hyprland.HyprctlGet('monitors')

const indicator = monitor => ({
    monitor,
    name: `indicator${monitor}`,
    className: 'indicator',
    layer: 'overlay',
    anchor: ['left'],
    child: { type: 'on-screen-indicator/vertical' },
});

const createBar = (id) => {
    return {
        name: `bar${id}`,
        className: 'bar',
        monitor: id,
        anchor: ['top', 'left', 'right'],
        exclusive: true,
        child: imports.widgets.bar.barContainer,
    }
}

const createNotifications = (id) => {
    return {
        name: `notifications${id}`,
        monitor: id,
        anchor: ['top'],
        margin: [12, 0],
        layer: 'overlay',
        child: { type: 'notifications/popups', transition: 'slide_down' },
    }
}

var quicksettingsWindow = {
    name: 'quicksettings',
    popup: true,
    anchor: ['top', 'right', 'bottom', 'left'],
    child: {
        type: 'layout',
        layout: 'topright',
        window: 'quicksettings',
        child: imports.widgets.quicksettings.quicksettingsContainer,
    },
}

var notificationsCenter = {
    name: 'notificationsCenter',
    popup: true,
    anchor: ['top', 'right', 'bottom', 'left'],
    child: {
        type: 'layout',
        layout: 'top',
        window: 'notificationsCenter',
        child: imports.widgets.notificationsCenter.notificationsCenterContainer,
    },
}


monitors.forEach(element => {
    windows.push(createBar(element.id))
    windows.push(createNotifications(element.id))
    windows.push(indicator(element.id))
});

windows.push(quicksettingsWindow)
windows.push(notificationsCenter)
