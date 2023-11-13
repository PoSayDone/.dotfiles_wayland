import * as mpris from '../../misc/mpris.js';
import { Mpris, Widget } from '../../imports.js';
import Separator from '../../misc/Separator.js';

const blackList = ['Caprine'];

const Header = player => mpris.FontColoredBox(player, {
    class_name: 'header-box',
    vertical: true,
    vexpand: true,
    children: [
        mpris.PlayerIcon(player, {
            size: 20,
            symbolic: true,
            hexpand: true,
            hpack: 'start',
        }),
    ],
});

const Footer = player => Widget.Box({
    class_name: 'footer-box',
    hexpand: true,
    children: [
        mpris.PreviousButton(player),
        mpris.PositionSlider(player),
        mpris.ShuffleButton(player),
        mpris.LoopButton(player),
        mpris.NextButton(player),
    ],
});

const Center = player => Widget.Box({
    class_name: 'center-box',
    orientation: 'horizontal',
    hexpand: true,
    children: [
        Widget.Box({
            class_name: 'title-box',
            vertical: true,
            vpack: 'center',
            hexpand: true,
            children: [
                mpris.TitleLabel(player, {
                    class_name: 'title',
                    xalign: 0,
                    justification: 'left',
                    truncate: 'end',
                    wrap: false,
                }),
                Separator(),
                mpris.ArtistLabel(player, {
                    class_name: 'artist',
                    xalign: 0,
                    justification: 'left',
                    truncate: 'end',
                    wrap: false,
                }),
            ],
        }),
        Widget.Box({
            vexpand: false,
            children: [
                mpris.PlayPauseButton(player),
            ],
        }),
    ],
});


const PlayerBox = player => Widget.Box({
    class_name: `player ${player.name}`,
    child: mpris.MaterialCoverArt(player, {
        class_name: 'cover-art',
        hexpand: true,
        vexpand: false,
        child: Widget.CenterBox({
            class_name: 'shader',
            hexpand: true,
            vertical: true,
            children: [
                Header(player),
                Center(player),
                Footer(player),
            ],
        }),
    }),
});

export default () => Widget.Box({
    vertical: true,
    class_name: 'media',
    properties: [['players', new Map()]],
    binds: [['children', Mpris, 'players', ps =>
        ps.filter(p => !blackList.includes(p.identity)).map(PlayerBox)]],
});
