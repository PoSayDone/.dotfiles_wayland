import Service from 'resource:///com/github/Aylur/ags/service.js';
import Mpris, { MprisPlayer } from 'resource:///com/github/Aylur/ags/service/mpris.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

class MaterialColors extends Service {
    static {
        Service.register(this, {}, {
            'colors': ['jsobject'],
            'cover-paths': ['jsobject'],
        });
    }

    #colors = new Map();
    #coverPaths = new Map();
    #connections = new Map();

    get colors() { return this.#colors; }
    get cover_paths() { return this.#coverPaths; }

    constructor() {
        super();

        Mpris.connect('player-added', (_, busName) => {
            const player = Mpris.getPlayer(busName);
            if (this.#connections.has(player))
                return;

            const id = player.connect(
                'notify::track-title',
                this.#onTrackId.bind(this),
            );
            player.notify('track-title');

            this.#connections.set(player, id);
        });

        Mpris.connect('player-closed', (_, busName) => {
            const player = Mpris.getPlayer(busName);
            if (!this.#connections.has(player))
                return;

            const id = this.#connections.get(player);
            player.disconnect(id);
            this.#connections.delete(player);
        });
    }

    /** @param {MprisPlayer} player */
    #onTrackId(player) {
        execAsync(`python ${App.configDir}/bin/getCoverColors ${player.coverPath}`)
            .then(commandString => {
                console.log(player.coverPath);
                this.#colors.set(player.busName, JSON.parse(commandString));
                this.notify('colors');
                this.#coverPaths.set(player.busName, player.coverPath);
                this.notify('cover-paths');
                this.emit('changed');
            })
            .catch(err => console.error(err.message));
    }
}

export default new MaterialColors();
