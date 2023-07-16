const { Widget } = ags;
const { Network, Bluetooth, Battery, Audio, System } = ags.Service;
const { runCmd, execAsync } = ags.Utils;
const { getColors } = imports.modules.mpris;
const { separator } = imports.modules.separator;

const slider = ({ icon, slider, arrowCmd }) => ({
    type: 'box',
    className: 'slider-box',
    children: [
        { type: icon, className: 'icon' },
        { type: slider, hexpand: true },
        {
            type: 'button',
            onClick: () => runCmd(arrowCmd),
            child: {
                type: 'icon',
                icon: 'pan-end-symbolic',
            },
        },
    ],
});

var quicksettingsWifi = {
    type: 'network/wifi-toggle',
    className: 'quicksettings__button',
    child: {
        type: 'box',
        orientation: 'horizontal',
        valign: 'center',
        children: [
            {
                type: 'box',
                className: 'quicksettings__button_icon',
                orientation: 'horizontal',
                children: [
                    { type: 'network/wifi-indicator' }
                ]
            },
            {
                type: 'box',
                orientation: 'vertical',
                hexpand: true,
                children: [
                    {
                        type: 'network/ssid-label',
                        halign: 'start',
                    },
                    {
                        type: 'network/wifi-status-label',
                        halign: 'start',
                    }
                ]
            },
        ]
    }
}

var quicksettingsBluetooth = {
    type: 'bluetooth/toggle',
    className: 'quicksettings__button',
    onClick: () => Bluetooth.enabled = !Bluetooth.enabled,
    child: {
        type: 'box',
        orientation: 'horizontal',
        valign: 'center',
        children: [
            {
                type: 'box',
                className: 'quicksettings__button_icon',
                orientation: 'horizontal',
                children: [
                    { type: 'bluetooth/indicator' }
                ]
            },
            {
                type: 'box',
                orientation: 'vertical',
                hexpand: true,
                children: [
                    {
                        type: 'label',
                        label: 'Bluetooth',
                        halign: 'start',
                    },
                    {
                        type: 'bluetooth/status-label',
                        halign: 'start',
                    }
                ]
            },
        ]
    }
}

var quicksettingsNotifications = {
    type: 'notifications/dnd-toggle',
    className: 'quicksettings__button',
    child: {
        type: 'box',
        orientation: 'horizontal',
        valign: 'center',
        children: [
            {
                type: 'box',
                className: 'quicksettings__button_icon',
                orientation: 'horizontal',
                children: [
                    { type: 'notifications/dnd-indicator' }
                ]
            },
            {
                type: 'box',
                orientation: 'vertical',
                hexpand: true,
                children: [
                    {
                        type: 'label',
                        label: 'Notifications',
                        halign: 'start',
                    },
                    {
                        type: 'notifications/status-label',
                        halign: 'start',
                    }
                ]
            },
        ]
    }
}


var quicksettingsMic = {
    type: 'audio/microphone-mute-toggle',
    className: 'quicksettings__button',
    child: {
        type: 'box',
        orientation: 'horizontal',
        valign: 'center',
        children: [
            {
                type: 'box',
                className: 'quicksettings__button_icon',
                orientation: 'horizontal',
                children: [
                    { type: 'audio/microphone-mute-indicator' }
                ]
            },
            {
                type: 'box',
                orientation: 'vertical',
                hexpand: true,
                children: [
                    {
                        type: 'label',
                        label: 'Microphone',
                        halign: 'start',
                    },
                    {
                        type: 'audio/microphone-mute-status',
                        halign: 'start',
                    }
                ]
            },
        ]
    }
}

var quicksettingsContainer = {
    type: 'box',
    orientation: 'vertical',
    className: 'quicksettings__container',
    children:
        [
            {
                type: 'box',
                children: [
                    quicksettingsWifi,
                    separator,
                    quicksettingsBluetooth
                ]
            },
            separator,
            {
                type: 'box',
                children: [
                    quicksettingsNotifications,
                    separator,
                    quicksettingsMic,
                ]
            },
            separator,
            {
                type: 'box',
                children: [
                    {
                        type: 'media/popup-content',
                        className: 'media',
                        orientation: 'vertical',
                        hexpand: true,
                    },
                ]
            },
            separator,
            {
                type: 'box',
                orientation: 'vertical',
                className: 'sliders',
                children: [
                    slider({
                        icon: 'audio/speaker-indicator',
                        slider: 'audio/speaker-slider',
                        arrowCmd: 'pavucontrol',
                    }),
                    separator,
                    slider({
                        icon: 'brightness/icon',
                        slider: 'brightness/slider',
                        arrowCmd: 'wl-gammactl',
                    }),
                ],
            },
        ]
}
