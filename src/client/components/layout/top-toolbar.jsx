/**
 * FinalShell-style top toolbar: quick actions always visible above the tabs.
 * Reuses existing store actions only, no new logic.
 */
import { auto } from 'manate/react'
import { Button, Tooltip } from 'antd'
import {
  PlusOutlined,
  DisconnectOutlined,
  FolderOutlined,
  DashboardOutlined,
  SettingOutlined
} from '@ant-design/icons'

const e = window.translate

export default auto(function TopToolbar (props) {
  const { store } = props
  const tab = store.currentTab
  const sftpOn = !!(tab && tab.sshSftpSplitView)
  const monitorOn = !!(store.config && store.config.remoteMonitorBarEnabled)

  const onNewSsh = () => {
    window.store.onNewSsh()
  }

  const onDisconnect = () => {
    if (store.activeTabId) {
      window.store.delTab(store.activeTabId)
    }
  }

  const onToggleSftp = () => {
    if (!tab) {
      return
    }
    tab.sshSftpSplitView = !tab.sshSftpSplitView
    window.store.triggerResize()
  }

  const onToggleMonitor = () => {
    window.store.setConfig({
      remoteMonitorBarEnabled: !monitorOn
    })
  }

  const onOpenSetting = () => {
    window.store.openSetting()
  }

  // keep clear of the absolute-positioned far-left icon bar + pinned panel
  const marginLeft = store.leftSideBarWidth +
    (store.pinned && !store.isMobile ? store.leftSidePanelWidth : 0)

  const btn = (key, icon, title, onClick, active, disabled) => (
    <Tooltip title={title} key={key} placement='bottom'>
      <Button
        icon={icon}
        onClick={onClick}
        disabled={disabled}
        className={active ? 'is-active' : ''}
      >
        {title}
      </Button>
    </Tooltip>
  )

  return (
    <div className='finalshell-toolbar' style={{ marginLeft }}>
      {btn('new', <PlusOutlined />, e('newSsh'), onNewSsh)}
      {btn('disc', <DisconnectOutlined />, '断开', onDisconnect, false, !store.activeTabId)}
      {btn('sftp', <FolderOutlined />, 'SFTP', onToggleSftp, sftpOn, !tab)}
      {btn('mon', <DashboardOutlined />, e('monitorBar'), onToggleMonitor, monitorOn)}
      {btn('set', <SettingOutlined />, e('setting'), onOpenSetting)}
    </div>
  )
})
