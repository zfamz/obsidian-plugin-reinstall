# Obsidian Plugin reinstall

aim to async project with git without the plugin's large file (main.js , styles.css)

## Config

1. set config to `.gitignore` file

```
/.obsidian/plugins/**/main.js
/.obsidian/plugins/**/styles.css
!/.obsidan/plugins/obsidian-plugin-reinstall
```

2. download the release files
3. put it in `/.obsidan/plugins/obsidian-plugin-reinstall` dir

## Usage

### backup plugins data

```
Plugin Resintall: Backup
```

### show the backup data

```
Plugin Resintall: Show
```

### reinstall the plugins by the backup date

```
Plugin Resintall: Reinstall
```
