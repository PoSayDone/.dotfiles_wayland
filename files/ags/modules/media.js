import { HoverRevealer, Separator } from '../modules/misc.js';
import * as mpris from '../modules/mpris.js';
import * as materialcolors from '../modules/materialcolors.js';
const { Box, CenterBox, Label, Button } = ags.Widget;
const { Mpris } = ags.Service;
const { timeout } = ags.Utils;

export const MediaBox = ({ player = mpris.prefer, ...props }) => mpris.MprisBox({
    ...props,
    className: 'mediabox',
    hexpand: true,
    player,
    children: [
        materialcolors.CoverArt({
            player,
            className: 'cover-art',
            hexpand: true,
            vexpand: false,
            children: [
                CenterBox({
                    className: 'shader',
                    vertical: true,
                    hexpand: true,
                    children: [
                        materialcolors.MaterialBox({
                            player,
                            className: 'header-box',
                            vertical: true,
                            vexpand: true,
                            children: [
                                mpris.PlayerIcon({
                                    player,
                                    size: 24,
                                    className: 'player',
                                    hexpand: true,
                                    halign: 'start',
                                    valign: 'start',
                                    symbolic: true,
                                }),
                            ],
                        }),
                        Box({
                            className: 'center-box',
                            orientation: 'horizontal',
                            hexpand: true,
                            children: [
                                materialcolors.MaterialBox({
                                    player,
                                    className: 'title-box',
                                    vertical: true,
                                    valign: 'center',
                                    hexpand: true,
                                    children: [
                                        mpris.TitleLabel({
                                            player,
                                            className: 'title',
                                            xalign: 0,
                                            justify: 'left',
                                        }),
                                        Separator(),
                                        mpris.ArtistLabel({
                                            player,
                                            className: 'artist',
                                            xalign: 0,
                                        }),
                                    ],
                                }),
                                Box({
                                    children: [
                                        materialcolors.ColoredBox({
                                            player,
                                            className: 'play-pause',
                                            hexpand: false,
                                            vexpand: false,
                                            children: [
                                                mpris.PlayPauseButton({
                                                    player,
                                                    className: 'play-pause',
                                                    vexpand: false,
                                                    halign: 'end',
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        materialcolors.MaterialBox({
                            player,
                            className: 'footerbox',
                            valign: 'end',
                            children: [
                                Box({
                                    className: 'controls',
                                    hexpand: true,
                                    children: [
                                        mpris.PreviousButton({ player }),
                                        mpris.PositionSlider({ hexpand: true, className: 'position-slider', player }),
                                        mpris.NextButton({ player }),
                                        mpris.ShuffleButton({  player }),
                                        mpris.LoopButton({  player }),
                                    ],
                                }),
                            ],
                        }),
                    ] }),
            ],
        }),
    ],
});

export const PopupContent = props => Box({
    vertical: true,
    className: 'media',
    ...props,
    properties: [['players', new Map()], ['activePlayer', '']],
    connections: [
        [Mpris, (box, busName) => {
            if (!busName || box._players.has(busName))
                return;

            const widget = MediaBox({ player: busName });
            box._players.set(busName, widget);
            box.add(widget);
            widget.show();
        }, 'player-added'],
    ],
});

export const PopupContentWithButtons = props => {
    const players = [];
    const activePlayer = 0;

    const PopupContent = Box({
        vertical: true,
        className: 'media',
        ...props,
        connections: [
            [Mpris, busName => {
                // if (!busName || players.forEach(item => item[0] === busName))
                //     players = [];

                const widget = MediaBox({ player: busName });
                players.push([busName, widget]);
                console.log(players);
            }, 'player-added'],
        ],
        children: [
            players[activePlayer]? players[activePlayer][1] : Box(),
        ],
    });
    const nextPlayer = Button(
        {
            onPrimaryClick: () => players._activePlayer += 1,
            child: Label({ label: 'haha' }),
        },
    );
    const previousPlayer = Button(
        {
            onPrimaryClick: () => players._activePlayer -= 1,
            child: Label({ label: 'haha' }),
        },
    );

    return Box({
        vertical: true,
        children: [
            PopupContent,
            Box({
                children: [
                    previousPlayer, Separator({ hexpand: true }), nextPlayer,
                ],
            }),
        ],
    });
};

export const PanelIndicator = ({
    player = mpris.prefer,
    direction = 'left',
    onPrimaryClick = () => Mpris.getPlayer(player)?.playPause(),
    ...props
} = {}) => mpris.MprisBox({
    ...props,
    className: 'media panel-button',
    player,
    children: [HoverRevealer({
        direction,
        onPrimaryClick,
        onScrollUp: () => Mpris.getPlayer(player)?.next(),
        onScrollDown: () => Mpris.getPlayer(player)?.previous(),
        onSecondaryClick: () => Mpris.getPlayer(player)?.playPause(),
        indicator: mpris.PlayerIcon({
            player,
            className: 'icon',
            symbolic: true,
        }),
        child: Box({
            children: [
                mpris.ArtistLabel({ player }),
                Label(' - '),
                mpris.TitleLabel({ player }),
            ],
        }),
        connections: [[Mpris, revealer => {
            const mpris = Mpris.getPlayer(player);
            if (!mpris)
                return;

            if (revealer._current === mpris.trackTitle)
                return;

            revealer._current = mpris.trackTitle;
            revealer.reveal_child = true;
            timeout(3000, () => {
                revealer.reveal_child = false;
            });
        }]],
    })],
});
