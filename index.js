const { Menu } = require('electron')
const menubar = require('menubar')
const path = require('path')
const execa = require('execa')

// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// })

const mb = menubar({ width: 1, height: 1 })
const imagesPath = path.join(__dirname, 'images')

mb.on('ready', function ready() {
  const defaults = execa.shellSync(
    'defaults read com.apple.finder CreateDesktop'
  ).stdout

  let visible = defaults === 'true'

  setIcon(visible)

  mb.tray.on('right-click', () => {
    mb.tray.setImage(`${imagesPath}/oh.png`)
    setTimeout(_ => mb.app.quit(), 500)
  })

  mb.tray.on('click', () => {
    visible = !visible
    toggleIcons(visible)
    setIcon(visible)
  })
})

const toggleIcons = visible => {
  /* change defaults */
  execa.shellSync(`defaults write com.apple.finder CreateDesktop ${visible}`)
  /* kill Finder, it will auto restart */
  execa.shellSync('killall Finder')
}

const setIcon = visible => {
  mb.tray.setImage(
    visible ? `${imagesPath}/visible.png` : `${imagesPath}/hidden.png`
  )
  mb.tray.setHighlightMode('never')
}
