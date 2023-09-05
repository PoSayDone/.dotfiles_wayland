const { Service, Widget } = ags;
const { CONFIG_DIR, exec, execAsync, timeout } = ags.Utils;
const { Mpris } = ags.Service;

var prefer = player => players => {
    let last;
    for (const [name, mpris] of players) {
        if (name.includes(player))
            return mpris;
        last = mpris;
    }
    return last;
};
class MaterialcolorsService extends Service {
    static { Service.register(this); }

    // static coverPath = '';

    getColors(url) {
        if (url !== 'undefined')
        {
            const commandString = `python ${CONFIG_DIR}/bin/getCoverColors "${url}"`;
            try {
                this._colors = JSON.parse(exec(commandString));
            }
            catch {
                return;
            }
            this.emit('changed');
        }
    }

    constructor() {
        super();
        this._colors = {
            primary: '#222222',
            onPrimary: '#ffffff',
            background: '#222222',
            onBackground: '#ffffff',
        };

        Mpris.instance.connect('changed', () => {
            this._mprisPlayer = Mpris.getPlayer('');
            this._coverPath = this._mprisPlayer.coverPath;
            this._colors = this.getColors(this.coverPath);
        });
    }

    get colors() { return this._colors; }
    get coverPath() { return this._coverPath; }
}

class Materialcolors {
    static { Service.export(this, 'Materialcolors'); }
    static instance = new MaterialcolorsService;
    static get colors() { return Materialcolors.instance._colors; }
    static get coverPath() { return Materialcolors.instance._coverPath; }
}

Widget.widgets['materialcolors/play-pause'] = props => Widget({
    ...props,
    type: 'mpris/play-pause-button',
    connections: [[Materialcolors, icon => {
        icon.setStyle(`
			background: ${Materialcolors.colors.primary}; \
			color: ${Materialcolors.colors.onPrimary};
		`);
    }]],
});

Widget.widgets['materialcolors/cover-art'] = props => Widget({
    ...props,
    type: 'mpris/cover-art',
    connections: [[Materialcolors, box => {
        box.setStyle(`
			background: radial-gradient(circle, rgba(0, 0, 0, 0.4) 30%, ${Materialcolors.colors.primary}), url("${Materialcolors.coverPath}"); \
			background-size: cover; \
			background-position: center; \
			color: ${Materialcolors.colors.onBackground};
		`);
    }]],
});

Widget.widgets['materialcolors/box'] = props => Widget({
    ...props,
    type: 'box',
    connections: [[Materialcolors, box => {
        box.setStyle(`
			color: ${Materialcolors.colors.onBackground};
		`);
    }]],
});
