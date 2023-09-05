const { Service, Widget } = ags;
const { Mpris, Settings } = ags.Service;
const { GLib } = imports.gi;
const { MEDIA_CACHE_PATH, CONFIG_DIR, execAsync, ensureDirectory, lookUpIcon } = ags.Utils;

var prefer = players => {
    const preferred = Settings.preferredMpris;
    let last;
    for (const [name, mpris] of players) {
        if (name.includes(preferred))
            return mpris;

        last = mpris;
    }

    return last;
};

Widget.widgets['mpris/box'] = ({ player = prefer, ...props }) => {
    const box = Widget({
        ...props,
        type: 'box',
        connections: [[Mpris, box => box.visible = Mpris.getPlayer(player)]],
    });
    const id = box.connect('draw', () => {
        box.visible = Mpris.getPlayer(player);
        box.disconnect(id);
    });
    return box;
};

Widget.widgets['mpris/cover-art'] = ({ player = prefer, ...props }) => Widget({
    ...props,
    type: 'box',
});

Widget.widgets['mpris/title-label'] = ({ player = prefer, ...props }) => Widget({
    ...props,
    type: 'label',
    connections: [[Mpris, label => {
        body = Mpris.getPlayer(player)?.trackTitle || '';
        label.label = body.length > 35 ? body.substring(0, 35) + '...' : body;
    }]],
});

Widget.widgets['mpris/artist-label'] = ({ player, ...props }) => Widget({
    ...props,
    type: 'label',
    connections: [[Mpris, label => {
        body = Mpris.getPlayer(player)?.trackArtists.join(', ') || '';
        label.label = body.length > 40 ? body.substring(0, 40) + '...' : body;
    }]],
});

Widget.widgets['mpris/player-label'] = ({ player, ...props }) => Widget({
    ...props,
    type: 'label',
    connections: [[Mpris, label => {
        label.label = Mpris.getPlayer(player)?.identity || '';
    }]],
});

Widget.widgets['mpris/player-icon'] = ({ symbolic = false, player = prefer, ...props }) => Widget({
    ...props,
    type: 'icon',
    connections: [[Mpris, icon => {
        const name = `${Mpris.getPlayer(player)?.entry}${symbolic ? '-symbolic' : ''}`;
        lookUpIcon(name)
            ? icon.icon_name = name
            : icon.icon_name = 'audio-x-generic-symbolic';
    }]],
});

Widget.widgets['mpris/volume-slider'] = ({ player = prefer, ...props }) => Widget({
    ...props,
    type: 'slider',
    onChange: value => {
        const mpris = Mpris.getPlayer(player);
        if (mpris && mpris.volume >= 0)
            Mpris.getPlayer(player).volume = value;
    },
    connections: [[Mpris, slider => {
        if (slider._dragging)
            return;

        const mpris = Mpris.getPlayer(player);
        slider.visible = mpris;
        if (mpris) {
            slider.visible = mpris.volume >= 0;
            slider.adjustment.value = mpris.volume;
        }
    }]],
});

Widget.widgets['mpris/volume-icon'] = ({ player = prefer, items }) => Widget({
    type: 'dynamic',
    items: items || [
        { value: 67, widget: { type: 'icon', label: 'audio-volume-high-symbolic' } },
        { value: 34, widget: { type: 'icon', label: 'audio-volume-medium-symbolic' } },
        { value: 1, widget: { type: 'icon', label: 'audio-volume-low-symbolic' } },
        { value: 0, widget: { type: 'icon', label: 'audio-volume-muted-symbolic' } },
    ],
    connections: [[Mpris, dynamic => {
        const mpris = Mpris.getPlayer(player);
        dynamic.visible = mpris?.volume >= 0;
        const value = mpris?.volume || 0;
        dynamic.update(threshold => threshold <= value*100);
    }]],
});

Widget.widgets['mpris/position-slider'] = ({ player = prefer, ...props }) => {
    const update = slider => {
        if (slider._dragging)
            return;

        const mpris = Mpris.getPlayer(player);
        slider.visible = mpris?.length > 0;
        if (mpris && mpris.length > 0)
            slider.adjustment.value = mpris.position/mpris.length;
    };
    return Widget({
        ...props,
        type: 'slider',
        onChange: value => {
            const mpris = Mpris.getPlayer(player);
            if (mpris && mpris.length >= 0)
                Mpris.getPlayer(player).position = mpris.length*value;
        },
        connections: [
            [Mpris, update],
            [1000, update],
        ],
    });
};

function _lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec0 = Math.floor(length % 60) < 10 ? '0' : '';
    const sec = Math.floor(length % 60);
    return `${min}:${sec0}${sec}`;
}

Widget.widgets['mpris/position-label'] = ({ player = prefer, ...props }) => {
    const update = label => {
        const mpris = Mpris.getPlayer(player);

        if (mpris && !label._binding) {
            label._binding = mpris.connect('position', (_, time) => {
                label.label = _lengthStr(time);
            });
            label.connect('destroy', () => {
                if (mpris)
                    mpris.disconnect(label._binding);

                label._binding = null;
            });
        }

        mpris && mpris.length > 0
            ? label.label = _lengthStr(mpris.position)
            : label.visible = mpris;

        return true;
    };

    return Widget({
        ...props,
        type: 'label',
        connections: [
            [Mpris, update],
            [1000, update],
        ],
    });
};

Widget.widgets['mpris/length-label'] = ({ player = prefer, ...props }) => Widget({
    ...props,
    type: 'label',
    connections: [[Mpris, label => {
        const mpris = Mpris.getPlayer(player);
        mpris && mpris.length > 0
            ? label.label = _lengthStr(mpris.length)
            : label.visible = mpris;
    }]],
});

Widget.widgets['mpris/slash'] = ({ player = prefer, ...props }) => Widget({
    ...props,
    type: 'label',
    label: '/',
    className: 'slash',
    connections: [
        [Mpris, label => {
            const mpris = Mpris.getPlayer(player);
            label.visible = mpris && mpris.length > 0;
        }],
    ],
});

const _playerButton = ({ player = prefer, items, onClick, prop, canProp, cantValue, ...rest }) => Widget({
    ...rest,
    type: 'button',
    child: { type: 'dynamic', items },
    onClick: () => Mpris.getPlayer(player)?.[onClick](),
    connections: [[Mpris, button => {
        const mpris = Mpris.getPlayer(player);
        if (!mpris || mpris[canProp] === cantValue)
            return button.hide();

        button.show();
        button.get_child().update(value => value === mpris[prop]);
    }]],
});

Widget.widgets['mpris/shuffle-button'] = ({
    player,
    enabled = { type: 'label', className: 'shuffle enabled', label: '󰒟' },
    disabled = { type: 'label', className: 'shuffle disabled', label: '󰒟' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: true, widget: enabled },
        { value: false, widget: disabled },
    ],
    onClick: 'shuffle',
    prop: 'shuffleStatus',
    canProp: 'shuffleStatus',
    cantValue: null,
});

Widget.widgets['mpris/loop-button'] = ({
    player,
    none = { type: 'label', className: 'loop none', label: '󰓦' },
    track = { type: 'label', className: 'loop track', label: '󰓦' },
    playlist = { type: 'label', className: 'loop playlist', label: '󰑐' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: 'None', widget: none },
        { value: 'Track', widget: track },
        { value: 'Playlist', widget: playlist },
    ],
    onClick: 'loop',
    prop: 'loopStatus',
    canProp: 'loopStatus',
    cantValue: null,
});

Widget.widgets['mpris/play-pause-button'] = ({
    player,
    playing = { hexpand: true, halign: 'center', type: 'icon', className: 'playing', icon: 'media-playback-pause-symbolic' },
    paused = { hexpand: true, halign: 'center', type: 'icon', className: 'paused', icon: 'media-playback-start-symbolic' },
    stopped = { hexpand: true, halign: 'center', type: 'icon', className: 'stopped', icon: 'media-playback-start-symbolic' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: 'Playing', widget: playing },
        { value: 'Paused', widget: paused },
        { value: 'Stopped', widget: stopped },
    ],
    className: 'play-pause',
    onClick: 'playPause',
    prop: 'playBackStatus',
    canProp: 'canPlay',
    cantValue: false,
});

Widget.widgets['mpris/previous-button'] = ({
    player,
    child = { type: 'label', className: 'previous', label: '󰒮' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: true, widget: child },
    ],
    onClick: 'previous',
    prop: 'canGoPrev',
    canProp: 'canGoPrev',
    cantValue: false,
});

Widget.widgets['mpris/next-button'] = ({
    player,
    child = { type: 'label', className: 'next', label: '󰒭' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: true, widget: child },
    ],
    onClick: 'next',
    prop: 'canGoNext',
    canProp: 'canGoNext',
    cantValue: false,
});
