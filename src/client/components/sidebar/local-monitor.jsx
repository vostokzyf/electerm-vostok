/**
 * 本机监控 (local machine hardware monitor)
 * FinalShell-style compact panel docked at the bottom of the left sidebar.
 * Data comes from the main process via window.pre.runGlobalAsync('getLocalSysInfo').
 * Unavailable sensors (e.g. CPU temp on macOS, no NVIDIA GPU) are hidden, never faked.
 */

import { useEffect, useState } from 'react'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import './local-monitor.styl'

const POLL_MS = 3000
const LS_KEY = 'vostokLocalMonitorCollapsed'

function Bar (props) {
  const v = Math.max(0, Math.min(100, Number(props.pct) || 0))
  return (
    <div className='lm-bar'>
      <div className='lm-bar-fill' style={{ width: v + '%' }} />
    </div>
  )
}

function fmtGB (bytes) {
  if (bytes == null || !Number.isFinite(Number(bytes))) {
    return '--'
  }
  return (Number(bytes) / 1073741824).toFixed(1)
}

function fmtPct (v) {
  return v != null && Number.isFinite(Number(v)) ? Number(v).toFixed(0) + '%' : '--'
}

export default function LocalMonitor () {
  const [info, setInfo] = useState(null)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(LS_KEY) === '1'
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    let alive = true
    let timer = null
    const fetchInfo = async () => {
      if (!alive || document.hidden) {
        return
      }
      try {
        const data = await window.pre.runGlobalAsync('getLocalSysInfo')
        if (alive && data) {
          setInfo(data)
        }
      } catch (e) {
        // keep last known values on transient failure
      }
    }
    fetchInfo()
    timer = setInterval(fetchInfo, POLL_MS)
    const onVis = () => {
      if (!document.hidden) {
        fetchInfo()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      alive = false
      if (timer) {
        clearInterval(timer)
      }
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      window.localStorage.setItem(LS_KEY, next ? '1' : '0')
    } catch (e) {
      // ignore
    }
  }

  const cpu = (info && info.cpu) || {}
  const mem = (info && info.mem) || null
  const gpus = (info && info.gpus) || []
  const memPct = mem && mem.total ? (mem.used / mem.total) * 100 : 0

  return (
    <div className={'local-monitor' + (collapsed ? ' collapsed' : ' expanded')}>
      <div
        className='lm-head'
        onClick={toggle}
        title={collapsed ? '展开' : '折叠'}
      >
        <span className='lm-title'>本机监控</span>
        {collapsed ? <EyeInvisibleOutlined /> : <EyeOutlined />}
      </div>
      {
        collapsed
          ? null
          : (
            <div className='lm-body'>
              <div className='lm-row'>
                <span className='lm-label'>CPU</span>
                <Bar pct={cpu.load} />
                <span className='lm-val'>
                  {fmtPct(cpu.load)}
                  {cpu.temp != null ? ' · ' + Number(cpu.temp).toFixed(0) + '°C' : ''}
                </span>
              </div>
              <div className='lm-row'>
                <span className='lm-label'>内存</span>
                <Bar pct={memPct} />
                <span className='lm-val'>{mem ? fmtGB(mem.used) + '/' + fmtGB(mem.total) + 'G' : '--'}</span>
              </div>
              {gpus.map((g, i) => (
                <div className='lm-gpu' key={i}>
                  <div className='lm-gpu-name' title={g.name}>{g.name}</div>
                  <div className='lm-row'>
                    <span className='lm-label'>GPU</span>
                    <Bar pct={g.util} />
                    <span className='lm-val'>{fmtPct(g.util)}</span>
                  </div>
                  <div className='lm-row lm-row-slim'>
                    <span className='lm-label'>温度</span>
                    <span className='lm-val'>
                      {g.temp != null ? Number(g.temp).toFixed(0) + '°C' : '--'}
                      {' · '}
                      {g.power != null ? Number(g.power).toFixed(0) + 'W' : '--'}
                    </span>
                  </div>
                  <div className='lm-row'>
                    <span className='lm-label'>显存</span>
                    <Bar pct={g.vramTotal ? (g.vramUsed / g.vramTotal) * 100 : 0} />
                    <span className='lm-val'>{fmtGB(g.vramUsed) + '/' + fmtGB(g.vramTotal) + 'G'}</span>
                  </div>
                </div>
              ))}
            </div>
            )
      }
    </div>
  )
}
