const { GObject } = imports.gi;
const { execAsync } = ags.Utils;
const { Service, Widget } = ags;
const { Mpris } = ags.Service;

class CoverColorsService extends Service {
    // constructor() {
    //     super();
    //     const player = Mpris.Player();
    //     player.connect('Metadata', () => {
    //         const metadata = player.Metadata;
    //         const artworkUrl = metadata['mpris:artUrl'];
    //         this.updateColors(artworkUrl);
    //     });
    // }
    
    static {
        Service.register(this, {
            'colors': [GObject.TYPE_STRING],
        });
    }

    colors = {
        primary: null,
        onPrimary: null,
        background: null,
        onBackground: null,
    };


    async updateColors(url) {
        const commandString = `python ${CONFIG_DIR}/bin/getCoverColors ${url}`;
        const colors = await execAsync(commandString);

        this.colors = {
            primary: colors.primary,
            onPrimary: colors.onPrimary,
            background: colors.background,
            onBackground: colors.onBackground,
        };

        this.emit('colors', colors.toString());
    }
    
    connectWidget(widget, callback) {
        const updateWidget = () => {
            const { primary, onPrimary, background, onBackground } = this.colors;
            const style = `
                background-color: ${background};
                color: ${onBackground};
            `;
            widget.setStyle(style);

            if (widget.label) {
                widget.label.setStyle(`color: ${onPrimary};`);
                widget.label.label = 'Colors';
            }
        };

        connect(this, widget, callback, 'changed');
        updateWidget();
    }
}

class CoverColors {
    static { Service.export(this, 'CoverColors'); }
    static instance = new CoverColorsService();
}