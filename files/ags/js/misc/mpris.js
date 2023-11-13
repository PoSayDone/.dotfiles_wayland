import icons from '../icons.js';
import { Utils, Widget } from '../imports.js';
import GLib from 'gi://GLib';
import MaterialColors from '../services/MaterialColors.js';

const MEDIA_CACHE_PATH = Utils.CACHE_DIR + '/media';

export const ColoredBox = (player, { ...props })  => Widget.Box({
    ...props,
    connections: [[MaterialColors, box => {
        const bus = player.busName;
        const colors = MaterialColors.colors.get(bus);
        if (MaterialColors.colors.get(bus))
        {
            box.setCss(`
				background: ${colors.primary}; \
				color: ${colors.onPrimary};
			`);
        }
    }]],
});

export const FontColoredBox = (player, { ...props }) => Widget.Box({
    ...props,
    connections: [[MaterialColors, box => {
        const bus = player.busName;
        const colors = MaterialColors.colors.get(bus);
        if (MaterialColors.colors.get(bus))
        {
            box.setCss(`
				color: ${colors.primary};
			`);
        }
    }]],
});

export const CoverArt = (player, props) => Widget.Box({
    ...props,
    binds: [['css', player, 'cover-path',
        path => `background: url("${path}"); background-size: cover; background-position: center;`]],
});

export const MaterialCoverArt = (player, props) => Widget.CenterBox({
    ...props,
    connections: [[MaterialColors, box => {
        const bus = player.busName;
        const colors = MaterialColors.colors.get(bus);
        const cover = MaterialColors.cover_paths.get(bus);
        if (MaterialColors.colors.get(bus))
        {
            box.setCss(`
				background:\
					radial-gradient(circle, rgba(0, 0, 0, 0.0) 1%,\
						${colors.primary}),\
					url("${cover}");\
				background-size: cover; \
				background-position: center; \
				color: ${colors.onBackground};
			`);
        }
    }]],
});

export const BlurredCoverArt = (player, props) => Widget.Box({
    ...props,
    class_name: 'blurred-cover',
    connections: [[player, box => {
        const url = player.coverPath;
        if (!url)
            return;

        const blurredPath = MEDIA_CACHE_PATH + '/blurred';
        const blurred = blurredPath +
            url.substring(MEDIA_CACHE_PATH.length);

        if (GLib.file_test(blurred, GLib.FileTest.EXISTS)) {
            box.setCss(`background-image: url("${blurred}")`);
            return;
        }

        Utils.ensureDirectory(blurredPath);
        Utils.execAsync(['convert', url, '-blur', '0x22', blurred])
            .then(() => box.setCss(`background-image: url("${blurred}")`))
            .catch(() => { });
    }, 'notify::cover-path']],
});

export const TitleLabel = (player, props) => Widget.Label({
    ...props,
    class_name: 'title',
    binds: [['label', player, 'track-title']],
});

export const ArtistLabel = (player, props) => Widget.Label({
    ...props,
    class_name: 'artist',
    binds: [['label', player, 'track-artists', a => a.join(', ') || '']],
});

export const PlayerIcon = (player, { symbolic = true, ...props } = {}) => Widget.Icon({
    ...props,
    class_name: 'player-icon',
    tooltipText: player.identity || '',
    connections: [[player, icon => {
        const name = `${player.entry}${symbolic ? '-symbolic' : ''}`;
        Utils.lookUpIcon(name)
            ? icon.icon = name
            : icon.icon = icons.mpris.fallback;
    }]],
});

export const PositionSlider = (player, props) => Widget.Slider({
    ...props,
    class_name: 'position-slider',
    hexpand: true,
    draw_value: false,
    on_change: ({ value }) => {
        player.position = player.length * value;
    },
    properties: [['update', slider => {
        if (slider.dragging)
            return;

        slider.visible = player.length > 0;
        if (player.length > 0)
            slider.value = player.position / player.length;
    }]],
    connections: [
        [player, s => s._update(s)],
        [player, s => s._update(s), 'position'],
        [1000, s => s._update(s)],
    ],
});

function lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec = Math.floor(length % 60);
    const sec0 = sec < 10 ? '0' : '';
    return `${min}:${sec0}${sec}`;
}

export const PositionLabel = player => Widget.Label({
    properties: [['update', (label, time) => {
        player.length > 0
            ? label.label = lengthStr(time || player.position)
            : label.visible = !!player;
    }]],
    connections: [
        [player, (l, time) => l._update(l, time), 'position'],
        [1000, l => l._update(l)],
    ],
});

export const LengthLabel = player => Widget.Label({
    connections: [[player, label => {
        player.length > 0
            ? label.label = lengthStr(player.length)
            : label.visible = !!player;
    }]],
});

export const Slash = player => Widget.Label({
    label: '/',
    connections: [[player, label => {
        label.visible = player.length > 0;
    }]],
});

const PlayerButton = ({ player, items, onClick, prop, canProp, cantValue }) => Widget.Button({
    child: Widget.Stack({
        items,
        binds: [['shown', player, prop, p => `${p}`]],
    }),
    on_clicked: player[onClick].bind(player),
    binds: [['visible', player, canProp, c => c !== cantValue]],
});

export const ShuffleButton = player => PlayerButton({
    player,
    items: [
        ['true', Widget.Icon({
            class_name: 'shuffle enabled',
            icon: icons.mpris.shuffle.enabled,
        })],
        ['false', Widget.Icon({
            class_name: 'shuffle disabled',
            icon: icons.mpris.shuffle.disabled,
        })],
    ],
    onClick: 'shuffle',
    prop: 'shuffle-status',
    canProp: 'shuffle-status',
    cantValue: null,
});

export const LoopButton = player => PlayerButton({
    player,
    items: [
        ['None', Widget.Icon({
            class_name: 'loop none',
            icon: icons.mpris.loop.none,
        })],
        ['Track', Widget.Icon({
            class_name: 'loop track',
            icon: icons.mpris.loop.track,
        })],
        ['Playlist', Widget.Icon({
            class_name: 'loop playlist',
            icon: icons.mpris.loop.playlist,
        })],
    ],
    onClick: 'loop',
    prop: 'loop-status',
    canProp: 'loop-status',
    cantValue: null,
});

export const PlayPauseButton = player => Widget.Box({
    class_name: 'play-pause',
    hexpand: false,
    vexpand: false,
    child: PlayerButton({
        class_name: 'play-pause',
        vexpand: false,
        hpack: 'end',
        player,
        items: [
            ['Playing', ColoredBox(player, {
                class_name: 'playing',
                child: Widget.Icon({
                    hexpand: true,
                    icon: icons.mpris.playing,
                }),
            })],
            ['Paused', ColoredBox(player, {
                class_name: 'paused',
                child: Widget.Icon({
                    hexpand: true,
                    icon: icons.mpris.paused,
                }),
            })],
            ['Stopped', ColoredBox(player, {
                class_name: 'stopped',
                child: Widget.Icon({
                    hexpand: true,
                    icon: icons.mpris.stopped,
                }),
            })],
        ],
        onClick: 'playPause',
        prop: 'play-back-status',
        canProp: 'can-play',
        cantValue: false,
    }),
});

export const PreviousButton = player => PlayerButton({
    player,
    items: [
        ['true', Widget.Icon({
            class_name: 'previous',
            icon: icons.mpris.prev,
        })],
    ],
    onClick: 'previous',
    prop: 'can-go-prev',
    canProp: 'can-go-prev',
    cantValue: false,
});

export const NextButton = player => PlayerButton({
    player,
    items: [
        ['true', Widget.Icon({
            class_name: 'next',
            icon: icons.mpris.next,
        })],
    ],
    onClick: 'next',
    prop: 'can-go-next',
    canProp: 'can-go-next',
    cantValue: false,
});
