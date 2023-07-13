const { App, Widget } = ags;
const { Hyprland, Applications } = ags.Service;
const { execAsync, exec, lookUpIcon, warning } = ags.Utils;
const { Bluetooth, Battery, Audio, System } = ags.Service;
const { keyboardlayout } = imports.modules.keyboardlayout;
const { separator } = imports.modules.separator;

const network = {
    type: 'box',
    className: 'indicator network',
    children: [{
        type: 'eventbox',
        onHover: eventbox => eventbox.get_child().get_children()[0].reveal_child = true,
        onHoverLost: eventbox => eventbox.get_child().get_children()[0].reveal_child = false,
        child: {
            type: 'box',
            children: [
                {
                    type: 'revealer',
                    transition: 'slide_right',
                    child: {
                        type: 'network/ssid-label'
                    },
                },
                { type: 'network/indicator' },
            ],
        },
    }],
};

const bluetooth = {
    type: 'box',
    className: 'indicator bluetooth',
    children: [{
        type: 'eventbox',
        onHover: eventbox => eventbox.get_child().get_children()[0].reveal_child = true,
        onHoverLost: eventbox => eventbox.get_child().get_children()[0].reveal_child = false,
        child: {
            type: 'box',
            children: [
                {
                    type: 'revealer',
                    transition: 'slide_right',
                    child: {
                        type: 'bluetooth/status',
                    },
                },
                {
                    type: 'icon',
                    className: 'device',
                    connections: [[Bluetooth, icon => {
                        icon.icon_name = Bluetooth.connectedDevices[0]?.iconName + '-symbolic';
                        icon.visible = Bluetooth.connectedDevices.length > 0;
                    }]],
                },
                {
                    type: 'bluetooth/indicator'
                },
            ],
        },
    }],
};

const audio = {
    type: 'box',
    className: 'indicator audio',
    children: [{
        type: 'eventbox',
        onHover: eventbox => eventbox.get_child().get_children()[0].reveal_child = true,
        onHoverLost: eventbox => eventbox.get_child().get_children()[0].reveal_child = false,
        onScrollUp: () => {
            Audio.speaker.volume += 0.02;
            ags.Service.Indicator.speaker();
        },
        onScrollDown: () => {
            Audio.speaker.volume -= 0.02;
            ags.Service.Indicator.speaker();
        },
        child: {
            type: 'box',
            children: [
                {
                    type: 'revealer',
                    transition: 'slide_right',
                    child: {
                        type: 'audio/speaker-label',
                    },
                },
                {
                    type: 'audio/speaker-indicator'
                },
            ],
        },
    }],
};

var barNotifications = {
    type: 'box',
    className: 'bar__notifications',
    hexpand: true,
    halign: 'start',
    children: [
        {
            type: 'notifications/notifications-indicator',
        }
    ]
}

var barQuicksettings = {
    type: 'eventbox',
    onClick: () => App.toggleWindow('quicksettings'),
    child:
    {
        type: 'box',
        className: 'bar__quicksettings',
        children: [
            network,
            separator,
            bluetooth,
            separator,
            audio,
        ]
    }
}

var launcher = {
    type: 'button',
    className: 'launcher',
    child: {
        type: 'box',
        className: 'launcher__icon',
        valign: 'center',
        halign: 'center',
        hexpand: true,
        vexpand: true,
    },
};

const indicator = {
    type: 'box',
    className: 'indicator',
    valign: 'center',
};

var workspaces = {
    type: 'eventbox',
    className: 'workspaces',
    child: {
        type: 'hyprland/workspaces',
        fixed: 9,
        active: indicator,
        occupied: indicator,
        empty: indicator,
    }
}

var clock = {
    type: 'eventbox',
    onClick: () => App.toggleWindow('notificationsCenter'),
    child: {
        type: 'clock'
    }
}

const left = {
    type: 'box',
    className: 'bar__left',
    orientation: 'horizontal',
    halign: 'start',
    hexpand: true,
    children: [
        launcher,
        separator,
        workspaces,
    ]
}

const center = {
    type: 'box',
    className: 'bar__center',
    children: [
        clock,
    ]
}

const battery = {
    type: 'box',
    className: 'battery',
    halign: 'end',
    children: [
        {
            type: 'battery/indicator',
        },
        {
            type: 'battery/level-label',
        },
    ]
}

const right = {
    type: 'box',
    className: 'bar__right',
    orientation: 'horizontal',
    children: [
        separator,
        barNotifications,
        barQuicksettings,
        separator,
        keyboardlayout,
        separator,
        battery,
    ]
}

var barContainer = {
    type: 'centerbox',
    className: 'bar__container',
    // orientation: 'horizontal',
    children: [
        left,
        center,
        right
    ]
}
