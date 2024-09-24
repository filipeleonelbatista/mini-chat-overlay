import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import config from '../config/config.json'
import fs from 'fs';
import path from 'path';

let configPath;

// Obtenha o caminho da raiz do projeto a partir do processo principal
ipcRenderer.invoke('get-app-path').then((appPath) => {
  configPath = path.join(appPath, 'src', 'config', 'config.json');
});

// Custom APIs for renderer
const api = {
  config,
  updateConfig: (newConfig) => {
    try {      
      fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');
      alert("Salvo com sucesso!")
    } catch (error) {
      console.log('error', error)
      alert("Erro ao salvar!")
    }
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(event, ...args)),
        removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
      }
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
