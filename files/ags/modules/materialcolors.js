const { Service } = ags;
const { Box } = ags.Widget;
const { USER, exec } = ags.Utils;
const { Mpris } = ags.Service;

class MaterialcolorsService extends Service {
    static { Service.register(this); }

    getColors(url) {
        if (url !== 'undefined')
        {
            const commandString = `python /home/${USER}/.config/ags/bin/getCoverColors "${url}"`;

            try {
                return JSON.parse(exec(commandString));
            }
            catch {
                return;
            }
        }
    }

    constructor() {
        super();

        this._colors = new Map();
        this._coverPaths = new Map();

        this._defaultColors = {
            primary: '#222222',
            onPrimary: '#ffffff',
            background: '#222222',
            onBackground: '#ffffff',
        };

        const id = Mpris.instance.connect('player-changed', (obj, busName) => {
            this._mprisPlayer = Mpris.instance.getPlayer(busName);
            this._coverPaths.set(busName, this._mprisPlayer.coverPath);
            this._colors.set(busName, this.getColors(this._mprisPlayer.coverPath) ?? this.defaultColors);
            this.emit('changed');
        });

        Mpris.instance.connect('player-closed', () => this.disconnect(id));
    }

    get colors() { return this._colors; }
    get coverPaths() { return this._coverPath; }
}

class Materialcolors  {
    static { Service.export(this, 'Materialcolors'); }
    static instance = new MaterialcolorsService();
    static get colors() { return Materialcolors.instance._colors; }
    static get defaultColors() { return Materialcolors.instance._defaultColors; }
    static get coverPaths() { return Materialcolors.instance._coverPaths; }
}

export const CoverArt = ({ player, ...props  } = {}) => Box({
    ...props,
    connections: [[Materialcolors, box => {
        if (Materialcolors.colors.get(player)) {
            box.setStyle(`
        	background: radial-gradient(circle, rgba(0, 0, 0, 0.4) 30%, \
			${Materialcolors.colors.get(player).primary}), \
			url("${Materialcolors.coverPaths.get(player)}"); \
        	background-size: cover; \
        	background-position: center; \
        	color: ${Materialcolors.colors.get(player).onBackground};
        `);
        }
    }]],
});

export const ColoredBox = ({ player, ...props  } = {}) => Box({
    ...props,
    connections: [[Materialcolors, icon => {
        if (Materialcolors.colors.get(player)) {
            icon.setStyle(`
				background: ${Materialcolors.colors.get(player).primary}; \
				color: ${Materialcolors.colors.get(player).onPrimary};
			`);
        }
    }]],
});

export const MaterialBox = ({ player, ...props  } = {}) => Box({
    ...props,
    connections: [[Materialcolors, box => {
        if (Materialcolors.colors.get(player)) {
            box.setStyle(`
				color: ${Materialcolors.colors.get(player).onBackground};
			`);
        }
    }]],
});
