import { app, shell, BrowserWindow } from 'electron'
import path from 'node:path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerRoute } from '../lib/electron-router-dom'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#17141f',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: {
      x: 20,
      y: 20,
    },
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../../build/icon.png'),
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  registerRoute({
    id: 'main',
    browserWindow: mainWindow,
    htmlFile: path.join(__dirname, '../renderer/index.html'),
  })

  // if (is.dev && process.env.ELECTRON_RENDERER_URL) {
  //   mainWindow.loadURL(devServerURL)
  // } else {
  //   mainWindow.loadFile(...fileRoute)
  // }
}

if (process.platform === 'darwin') {
  app.dock.setIcon(path.resolve(__dirname, 'icon.png'))
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
