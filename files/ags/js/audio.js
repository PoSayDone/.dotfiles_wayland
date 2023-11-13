import icons from './icons.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import { Label, Box, Icon, Stack, Button, Slider } from 'resource:///com/github/Aylur/ags/widget.js';
import { Utils } from './imports.js';

const iconSubstitute = item => {
    const substitues = [
        { from: 'audio-headset-bluetooth', to: 'audio-headphones-symbolic' },
        { from: 'audio-card-analog-usb', to: 'audio-speakers-symbolic' },
        { from: 'audio-card-analog-pci', to: 'audio-card-symbolic' },
    ];

    for (const { from, to } of substitues) {
        if (from === item)
            return to;
    }
    return item;
};

export const SpeakerIndicator = () => Icon({
    connections: [[Audio, icon => {
        if (!Audio.speaker)
            return;

        const { muted, low, medium, high, overamplified } = icons.audio.volume;

        if (Audio.speaker.stream.isMuted)
            return icon.icon = muted;

        icon.icon = [[101, overamplified], [67, high], [34, medium], [1, low], [0, muted]]
            .find(([threshold]) => threshold <= Audio.speaker.volume * 100)[1];
    }, 'speaker-changed']],
});

export const SpeakerTypeIndicator = props => Icon({
    ...props,
    connections: [[Audio, icon => {
        if (Audio.speaker)
            icon.icon = iconSubstitute(Audio.speaker.iconName);
    }]],
});

export const SpeakerPercentLabel = props => Label({
    ...props,
    connections: [[Audio, label => {
        if (!Audio.speaker)
            return;

        label.label = `${Math.floor(Audio.speaker.volume * 100)}%`;
    }, 'speaker-changed']],
});

export const SpeakerSlider = props => Slider({
    ...props,
    draw_value: false,
    on_change: ({ value }) => Audio.speaker.volume = value,
    connections: [[Audio, slider => {
        if (!Audio.speaker)
            return;

        slider.sensitive = !Audio.speaker.stream.isMuted;
        slider.value = Audio.speaker.volume;
    }, 'speaker-changed']],
});

export const MicrophoneMuteIndicator = ({
    muted = Icon('microphone-disabled-symbolic'),
    unmuted = Icon('microphone-sensitivity-high-symbolic'),
    ...props
} = {}) => Stack({
    ...props,
    items: [
        ['true', muted],
        ['false', unmuted],
    ],
    connections: [[Audio, stack => {
        stack.shown = `${Audio.microphone?.isMuted}`;
    }, 'microphone-changed']],
});

export const MicrophoneMuteToggle = props => Button({
    ...props,
    on_clicked: () => Utils.execAsync('pactl set-source-mute @DEFAULT_SOURCE@ toggle'),
    connections: [[Audio, button => {
        if (!Audio.microphone)
            return;

        button.toggleClassName('active', !Audio.microphone.isMuted);
    }, 'microphone-changed']],
});

export const MicrophoneStatus = props => Label({
    ...props,
    connections: [[Audio, label => {
        if (!Audio.microphone)
        {
            label.label = 'Not found';
        }
        else {
            if (Audio.microphone.isMuted)
                label.label = 'Off';
            else
                label.label = 'On';
        }
    }, 'microphone-changed']],
});

export const AppMixer = props => {
    const AppItem = stream => {
        const icon = Icon();
        const label = Label({ xalign: 0, justify: 'left', wrap: true, ellipsize: 3 });
        const percent = Label({ xalign: 1 });
        const slider = Slider({
            hexpand: true,
            draw_value: false,
            on_change: ({ value }) => {
                stream.volume = value;
            },
        });
        const sync = () => {
            icon.icon = stream.iconName;
            icon.tooltipText = stream.name;
            slider.value = stream.volume;
            percent.label = `${Math.floor(stream.volume * 100)}%`;
            label.label = stream.description || '';
        };
        const id = stream.connect('changed', sync);
        return Box({
            hexpand: true,
            children: [
                icon,
                Box({
                    children: [
                        Box({
                            vertical: true,
                            children: [
                                label,
                                slider,
                            ],
                        }),
                        percent,
                    ],
                }),
            ],
            connections: [['destroy', () => stream.disconnect(id)]],
            setup: sync,
        });
    };

    return Box({
        ...props,
        vertical: true,
        connections: [[Audio, box => {
            box.children = Array.from(Audio.apps.values())
                .map(stream => AppItem(stream));
        }]],
    });
};

export const StreamSelector = ({ streams = 'speakers', ...props } = {}) => Box({
    ...props,
    vertical: true,
    connections: [[Audio, box => {
        box.children = Array.from(Audio[streams].values()).map(stream => Button({
            child: Box({
                children: [
                    Icon({
                        icon: iconSubstitute(stream.iconName),
                        tooltipText: stream.iconName,
                    }),
                    Label(stream.description.split(' ').slice(0, 4).join(' ')),
                    Icon({
                        icon: 'object-select-symbolic',
                        hexpand: true,
                        hpack: 'end',
                        connections: [['draw', icon => {
                            icon.visible = Audio.speaker === stream;
                        }]],
                    }),
                ],
            }),
            on_clicked: () => {
                if (streams === 'speakers')
                    Audio.speaker = stream;

                if (streams === 'microphones')
                    Audio.microphone = stream;
            },
        }));
    }]],
});
