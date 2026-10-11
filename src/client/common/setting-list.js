import {
  settingSyncId,
  settingShortcutsId,
  settingTerminalId,
  settingAiId,
  settingPasswordsId
} from '../common/constants'
const e = window.translate

export default () => {
  const list = [
    {
      id: settingTerminalId,
      title: e('terminal')
    },
    {
      id: settingShortcutsId,
      title: e('settingShortcuts')
    },
    {
      id: settingSyncId,
      title: e('settingSync')
    },
    {
      id: settingAiId,
      title: 'AI'
    },
    {
      id: settingPasswordsId,
      title: e('password')
    }
  ]
  // FinalShell-style fork: keep only 通用(default) / 终端 / 连接相关(密码);
  // hide AI, 同步, 快捷键 sections
  const hiddenIds = [settingAiId, settingSyncId, settingShortcutsId]
  return list.filter(item => !hiddenIds.includes(item.id))
}
