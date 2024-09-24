import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, Menu, nativeTheme, shell, Tray } from 'electron'
import { join } from 'path'
import closeDarkIcon from '../../resources/close-dark.png?asset'
import closeLightIcon from '../../resources/close-light.png?asset'
import configDarkIcon from '../../resources/config-dark.png?asset'
import configLightIcon from '../../resources/config-light.png?asset'
import aboutDarkIcon from '../../resources/about-dark.png?asset'
import aboutLightIcon from '../../resources/about-light.png?asset'
import icon from '../../resources/icon.png?asset'
import pixDarkIcon from '../../resources/pix-dark.png?asset'
import pixLightIcon from '../../resources/pix-light.png?asset'
import iconTray from '../../resources/tray.png?asset'
import { discordService } from '../services/discordService'
import { twitchService } from '../services/twitchService'
import { youtubeService } from '../services/youtubeService'
import config from "../config/config.json"
import * as path from 'path'
import * as chokidar from 'chokidar';

let tray: Tray | null = null
let clickTimeout: NodeJS.Timeout | null = null
let watcher: chokidar.FSWatcher;

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 300,
    minWidth: 300,
    height: 450,
    minHeight: 450,
    transparent: true,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    alwaysOnTop: true,
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function startChatServices() {  
  if(config.showDiscord){
    discordService.init()  
    discordService.onMessage((data) => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) {
        win.webContents.send('chat-message', data)
      }
    })
  }
  if(config.showTwitch){
    twitchService.init()  
    twitchService.onMessage((data) => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) {
        win.webContents.send('chat-message', data)
      }
    })
  }
  if(config.showYoutube){
    youtubeService.onMessage((data) => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) {
        win.webContents.send('chat-message', data)
      }
    });
  }  
}

function setupFileWatcher() {
  // Path to the config file
  const configFilePath = path.join(app.getAppPath(), 'src', 'config', 'config.json');

  // Create a watcher to monitor changes
  watcher = chokidar.watch(configFilePath, {
    persistent: true,
  });

  // Restart application on file change
  watcher.on('change', () => {
    console.log('Configuration file changed, restarting application...');
    app.relaunch(); // Restart the application
    app.quit(); // Quit the current instance
  });
}

function createTray() {
  tray = new Tray(iconTray)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Gostou do App? Pague-me um café!',
      icon: nativeTheme.shouldUseDarkColors ? pixDarkIcon : pixLightIcon,
      click: () => {
        shell.openExternal('https://filipeleonelbatista.github.io/mini-chat-overlay')
      }
    },
    {
      label: 'Preferências',
      icon: nativeTheme.shouldUseDarkColors ? configDarkIcon : configLightIcon,
      click: () => {
        const configPath = path.join(app.getAppPath(), 'src', 'config', 'config.json');
        shell.openPath(configPath).catch(err => console.error(err));
      }
    },
    {
      label: 'Sobre o App',
      icon: nativeTheme.shouldUseDarkColors ? aboutDarkIcon : aboutLightIcon,
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Sobre o App',
          message: 'Este é um aplicativo de chat para visualizar mensagens do Twitch e YouTube.',
          detail: `Para modificar as prefêrencias use as classes do TailwindCSS.\n\nDesenvolvido por Filipe de Leonel Batista.\nVersão ${app.getVersion()}`,
          buttons: ['Ir para o site', 'Me pague um café!', 'Fechar'],
          defaultId: 0,
          cancelId: 2
        }).then(result => {
          switch (result.response) {
            case 0:
              shell.openExternal('https://filipeleonelbatista.dev.br/links')
              break
            case 1:
              shell.openExternal('https://filipeleonelbatista.github.io/mini-chat-overlay')
              break
          }
        }).catch(err => console.error(err))
      }
    },
    {
      label: 'Fechar',
      icon: nativeTheme.shouldUseDarkColors ? closeDarkIcon : closeLightIcon,
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('Mini Chat Overlay Menu')
  tray.setContextMenu(contextMenu)

  tray.on('click', (_event, _bounds, _position) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      clickTimeout = null
      const win = BrowserWindow.getAllWindows()[0]
      if (win) {
        win.show()
      } else {
        createWindow()
      }
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null
        tray?.popUpContextMenu()
      }, 300)
    }
  })

  tray.on('right-click', () => {
    tray?.popUpContextMenu()
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  startChatServices()

  createTray()

  setupFileWatcher()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
app.on('before-quit', () => {
  twitchService.disconnect();
  youtubeService.disconnect();
});