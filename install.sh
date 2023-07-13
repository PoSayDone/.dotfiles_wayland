#!/bin/bash

#
# SCRIPT NOT WORKING NOW, WOULD FIX IN THE FUTURE
#

DIR=$HOME/.config
bold=$(tput bold)
normal=$(tput sgr0)

cd $HOME
clear

#Dependencies
echo -e "\e[1;31m${bold}Installing dependencies${normal}\e[0m"
yay -Syu --noconfirm 'hyprland-git' 'rofi-lbonn-wayland-only-git' 'alsa-tools' \
  'alsa-utils' 'bluez' 'bluez-utils' 'trash-cli' 'swaylock-effects' 'polkit-gnome'\
  'brightnessctl' 'git' 'zathura' 'zathura-pdf-mupdf' 'bpytop' 'wl-gammactl' \
  'neovim' 'spotify' 'npm' 'lutris' 'discord-screenaudio' 'cmake' \
  'base-devel' 'python' 'python-pip' 'lf' 'joshuto-git' 'meson' \
  'zsh' 'playerctl' 'pamixer' 'pavucontrol' 'adw-gtk3' --needed

#Installing ags
git clone https://github.com/Aylur/ags.git
cd ags
meson setup build
meson install -C build
clear

#Cloning dots
echo -e "\e[1;31m${bold}Cloning dotfiles${normal}\e[0m"
git clone https://github.com/PoSayDone/.dotfiles_wayland.git

#Removing previous configs
rm -rf\
  $DIR/hypr\
  $DIR/ags\
  $DIR/kitty\
  $DIR/joshuto\
  $DIR/rofi\
  $DIR/lf\
  $DIR/discord-screenaudio\
  "$DIR/gtk-3.0"\
  "$DIR/gtk-4.0"\
clear

#Symlinks
echo -e "\e[1;31m${bold}Symlinking dotfiles${normal}\e[0m"
ln -sf $HOME/.dotfiles_wayland/files/* $DIR
ln -sf "$DIR/files/gtk-4.0/gtk.css $HOME/.config/gtk-3.0"
clear

#Fonts
echo -e "\e[1;31m${bold}Copying fonts${normal}\e[0m"
mkdir $HOME/.fonts
ln -sf $HOME/.dotfiles_wayland/files/additional/fonts/* $HOME/.fonts
fc-cache -r
clear

#Apps/scripts symlinking
echo -e "\e[1;31m${bold}Creating apps shortcuts${normal}\e[0m"
mkdir $HOME/.local/share/bin
sudo ln -sf $HOME/.dotfiles_wayland/additional/scripts/* $HOME/.local/share/bin
mkdir $HOME/.local/share/applications
ln -sf $HOME/.dotfiles_wayland/additional/applications/* $HOME/.local/share/applications
clear

#Astronvim installation
echo -e "\e[1;31m${bold}Installing Astronvim${normal}\e[0m"

mv ~/.config/nvim ~/.config/nvim.bak
mv ~/.local/share/nvim ~/.local/share/nvim.bak
mv ~/.local/state/nvim ~/.local/state/nvim.bak
mv ~/.cache/nvim ~/.cache/nvim.bak

git clone https://github.com/AstroNvim/AstroNvim ~/.config/nvim
mkdir $HOME/.config/nvim/lua/user
git clone https://github.com/posaydone/astroconf.git $HOME/.config/nvim/lua/user
kitty -e nvim &
clear

#zsh4humans installation
if command -v curl >/dev/null 2>&1; then
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/romkatv/zsh4humans/v5/install)"
else
  sh -c "$(wget -O- https://raw.githubusercontent.com/romkatv/zsh4humans/v5/install)"
fi
