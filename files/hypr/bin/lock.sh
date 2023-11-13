#!/usr/bin/bash
swayidle -w \
	timeout 3000 'systemctl suspend' \
	before-sleep 'playerctl pause' \
	before-sleep 'gtklock -d'
