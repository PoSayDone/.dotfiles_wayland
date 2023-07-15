const { App, Widget } = ags;
const { Mpris } = ags.Service;
const { timeout, CONFIG_DIR, execAsync } = ags.Utils;
const { separator } = imports.modules.separator;

var prefer = player => players => {
    let last;
    for (const [name, mpris] of players) {
        if (name.includes(player))
            return mpris;
        last = mpris;
    }
    return last;
};

const slash = player => ({
    type: 'label', label: '/',
    connections: [
        [Mpris, label => {
            const mpris = Mpris.getPlayer(player);
            label.visible = mpris && mpris.length > 0;
        }],
    ],
});

const mediabox = (player, className) => ({
    type: 'mpris/box', player,
    className: `mediabox ${className}`,
    hexpand: true,
    vexpand: true,
    children: [
        {
            type: 'mpris/cover-art', player,
            className: 'cover-art',
            hexpand: true,
            vexpand: true,
            children: [{
                type: 'centerbox',
                className: 'shader',
                orientation: 'vertical',
                hexpand: true,
                children: [
                    {
                        className: 'header-box',
                        type: 'box',
                        orientation: 'vertical',
                        vexpand: true,
                        children: [
                            {
                                type: 'mpris/player-icon', player,
                                size: 24,
                                className: 'player',
                                hexpand: true,
                                halign: 'start',
                                valign: 'start',
                                symbolic: true,
                            },
                        ],
                    },
                    {
                        className: 'center-box',
                        type: 'box',
                        orientation: 'horizontal',
                        hexpand: true,
                        children: [
                            {
                                className: 'title-box',
                                type: 'box',
                                orientation: 'vertical',
                                valign: 'center',
                                hexpand: true,
                                children: [
                                    {
                                        type: 'mpris/title-label', player,
                                        className: 'title',
                                        maxWidth: 1,
                                        xalign: 0,
                                        justify: 'left',
                                        wrap: true,
                                    },
                                    separator,
                                    {
                                        type: 'mpris/artist-label', player,
                                        className: 'artist',
                                        xalign: 0,
                                    },
                                ],
                            },
                            {
                                type: 'box',
                                orientation: 'horizontal',
                                children: [
                                    {
                                        vexpand: false,
                                        halign: 'end',
                                        type: 'mpris/play-pause-button',
                                        connections: [[Mpris, icon => {
                                            const url = Mpris.getPlayer(player)?.coverPath;
                                            if (!url)
                                                return;
                                            const commandString = ['python', `${CONFIG_DIR}/bin/getCoverColors`, url]
                                            execAsync(commandString, colors => {
                                                colors = JSON.parse(colors)
                                                icon.setStyle(`
                                                    background: ${colors.primary}; \
                                                    color: ${colors.onPrimary};
                                                `);
                                            });
                                        }]],
                                        player,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        className: 'footerbox',
                        type: 'box',
                        valign: 'end',
                        children: [
                            {
                                className: 'controls',
                                type: 'box',
                                hexpand: true,
                                children: [
                                    { type: 'mpris/previous-button', player },
                                    { type: 'mpris/position-slider', hexpand: true, className: 'position-slider', player },
                                    { type: 'mpris/next-button', player },
                                    { type: 'mpris/shuffle-button', player },
                                    { type: 'mpris/loop-button', player },
                                ],
                            },
                        ],
                    },
                ],
            }],
        },
    ],
});

Widget.widgets['media/panel-button'] = ({ player = prefer('spotify') }) => Widget({
    type: 'mpris/box',
    className: 'mpris',
    player,
    children: [{
        type: 'button',
        onClick: () => App.toggleWindow('media'),
        onSecondaryClick: () => Mpris.getPlayer(player)?.playPause(),
        onScrollUp: () => Mpris.getPlayer(player)?.next(),
        onScrollDown: () => Mpris.getPlayer(player)?.previous(),
        child: {
            type: 'box',
            children: [
                { type: 'mpris/player-icon', player, halign: 'start', size: 18 },
                ' ',
                { type: 'mpris/artist-label', className: 'artist', player },
                ' - ',
                { type: 'mpris/title-label', className: 'title', player },
            ],
        },
    }],
});

Widget.widgets['media/popup-content'] = props => Widget({
    ...props,
    type: 'box',
    children: [
        mediabox('', ''),
    ],
});

const icon = player => ({ type: 'mpris/player-icon', player });
const reaveler = player => ({
    type: 'revealer',
    transition: 'slide_left',
    child: {
        type: 'box',
        children: [
            { type: 'mpris/artist-label', className: 'artist', player },
            ' - ',
            { type: 'mpris/title-label', className: 'title', player },
        ],
    },
});


Widget.widgets['media/indicator'] = ({
    player = prefer('spotify'),
    direction = 'left',
    onClick = () => Mpris.getPlayer(player)?.playPause(),
    ...props
}) => Widget({
    ...props,
    type: 'mpris/box',
    player,
    children: [{
        type: 'eventbox',
        onHover: box => {
            timeout(200, () => box._revealed = true);
            box.get_child().get_children()[direction === 'left' ? 0 : 1].reveal_child = true;
        },
        onHoverLost: box => {
            if (!box._revealed)
                return;

            timeout(200, () => box._revealed = false);
            box.get_child().get_children()[direction === 'left' ? 0 : 1].reveal_child = false;
        },
        onClick,
        onSecondaryClick: () => Mpris.getPlayer(player)?.playPause(),
        onScrollUp: () => Mpris.getPlayer(player)?.next(),
        onScrollDown: () => Mpris.getPlayer(player)?.previous(),
        connections: [[Mpris, box => {
            const mpris = Mpris.getPlayer(player);
            if (!mpris)
                return;

            if (box._current === mpris.trackTitle)
                return;

            box._current = mpris.trackTitle;
            box.get_child().get_children()[direction === 'left' ? 0 : 1].reveal_child = true;
            timeout(5000, () => {
                box.get_child().get_children()[direction === 'left' ? 0 : 1].reveal_child = false;
            });
        }]],
        child: {
            type: 'box',
            children: direction === 'left'
                ? [reaveler(player), icon(player)]
                : [icon(player), reaveler(player)],
        },
    }],
});
