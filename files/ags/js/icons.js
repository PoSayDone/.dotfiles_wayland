export default {
    settings: 'emblem-system-symbolic',
    tick: 'object-select-symbolic',
    lock: 'system-lock-screen-symbolic',
    audio: {
        mic: {
            muted: 'microphone-disabled-symbolic',
            unmuted: 'microphone-sensitivity-high-symbolic',
        },
        volume: {
            muted: 'audio-volume-muted-symbolic',
            low: 'audio-volume-low-symbolic',
            medium: 'audio-volume-medium-symbolic',
            high: 'audio-volume-high-symbolic',
            overamplified: 'audio-volume-overamplified-symbolic',
        },
        type: {
            headset: 'audio-headphones-symbolic',
            speaker: 'audio-speakers-symbolic',
            card: 'audio-card-symbolic',
        },
        mixer: 'media-playlist-shuffle-symbolic',
    },
    asusctl: {
        profile: {
            Balanced: 'power-profile-balanced-symbolic',
            Quiet: 'power-profile-power-saver-symbolic',
            Performance: 'power-profile-performance-symbolic',
        },
        mode: {
            Integrated: '',
            Hybrid: '󰢮',
        },
    },
    apps: {
        apps: 'view-app-grid-symbolic',
        search: 'folder-saved-search-symbolic',
    },
    battery: {
        charging: '󱐋',
        warning: 'battery-empty-symbolic',
    },
    bluetooth: {
        enabled: 'bluetooth-active-symbolic',
        disabled: 'bluetooth-disabled-symbolic',
    },
    brightness: {
        indicator: 'display-brightness-symbolic',
        keyboard: 'keyboard-brightness-symbolic',
        screen: 'display-brightness-symbolic',
    },
    powermenu: {
        sleep: 'weather-clear-night-symbolic',
        reboot: 'system-reboot-symbolic',
        logout: 'system-log-out-symbolic',
        shutdown: 'system-shutdown-symbolic',
    },
    recorder: {
        recording: 'media-record-symbolic',
    },
    notifications: {
        noisy: 'preferences-system-notifications-symbolic',
        silent: 'notifications-disabled-symbolic',
    },
    trash: {
        full: 'user-trash-full-symbolic',
        empty: 'user-trash-symbolic',
    },
    mpris: {
        fallback: 'audio-x-generic-symbolic',
        shuffle: {
            enabled: 'media-playlist-shuffle-symbolic',
            disabled: 'media-playlist-shuffle-symbolic',
        },
        loop: {
            none: 'media-playlist-repeat-symbolic',
            track: 'media-playlist-repeat-symbolic',
            playlist: 'media-playlist-repeat-symbolic',
        },
        playing: 'media-playback-pause-symbolic',
        paused: 'media-playback-start-symbolic',
        stopped: 'media-playback-start-symbolic',
        prev: 'media-skip-backward-symbolic',
        next: 'media-skip-forward-symbolic',
    },
    ui: {
        arrow: {
            right: 'pan-end-symbolic',
            left: 'pan-start-symbolic',
            down: 'pan-down-symbolic',
            up: 'pan-up-symbolic',
        },
    },
    system: {
        cpu: 'org.gnome.SystemMonitor-symbolic',
        ram: 'drive-harddisk-solidstate-symbolic',
        temp: 'temperature-symbolic',
    },
};
