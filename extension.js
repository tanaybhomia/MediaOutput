import GObject from 'gi://GObject';
import St from 'gi://St';
import Gio from 'gi://Gio';
import Gvc from 'gi://Gvc';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

const OutputIndicator = GObject.registerClass(
class OutputIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Media Output Switcher');

        this.icon = new St.Icon({
            icon_name: 'audio-speakers-symbolic',
            style_class: 'system-status-icon',
        });
        this.add_child(this.icon);

        this.mixerControl = new Gvc.MixerControl({ name: 'MediaOutput Switcher' });
        this.mixerControl.open();

        this.mixerControl.connect('state-changed', () => this._updateMenu());
        this.mixerControl.connect('default-sink-changed', () => this._updateMenu());
        this.mixerControl.connect('stream-added', () => this._updateMenu());
        this.mixerControl.connect('stream-removed', () => this._updateMenu());

        this.menu.connect('open-state-changed', (menu, isOpen) => {
            if (isOpen) this._updateMenu();
        });
        
        this._updateMenu();
    }

    _updateMenu() {
        this.menu.removeAll();

        const devices = this.mixerControl.get_sinks();
        const defaultSink = this.mixerControl.get_default_sink();

        devices.forEach(device => {
            const item = new PopupMenu.PopupMenuItem(device.get_description());
            if (defaultSink && device.get_id() === defaultSink.get_id()) {
                item.setOrnament(PopupMenu.Ornament.DOT);
            }
            item.connect('activate', () => {
                this.mixerControl.set_default_sink(device);
            });
            this.menu.addMenuItem(item);
        });
    }

    destroy() {
        this.mixerControl.close();
        super.destroy();
    }
});

export default class MediaOutputExtension extends Extension {
    enable() {
        this._indicator = new OutputIndicator();
        Main.panel.addToStatusArea('MediaOutputIndicator', this._indicator);

        this._settings = this.getSettings('org.gnome.shell.extensions.media-output');

        Main.wm.addKeybinding(
            'shortcut-popup',
            this._settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.ALL,
            () => {
                this._indicator.menu.toggle();
            }
        );
    }

    disable() {
        Main.wm.removeKeybinding('shortcut-popup');
        this._settings = null;
        this._indicator.destroy();
        this._indicator = null;
    }
}
