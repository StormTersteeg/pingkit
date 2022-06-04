import webview, os, sys, requests
from win10toast import ToastNotifier

def on_closed():
  pass

def on_closing():
  pass

def on_shown():
  pass

def on_loaded():
  pass

class Api:
  def __init__(self):
    self.sites = []
    self.notifications = False

  def openChild(self, url):
    window.hide()
    child = webview.create_window(url, url)

  def fetchSites(self, sites):
    response = []

    for site in sites:
      headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'}
      post = requests.get(site["url"], headers=headers)

      ping = int(post.elapsed.total_seconds()*1000)
      size = len(post.text)
      status = post.status_code

      response.append({
        'ping': ping,
        'size': size,
        'status': status
      })

    return response

  def doNotification(self, message):
    toaster.show_toast("pingkit",message,icon_path='')

  def toggleNotifications(self):
    self.notifications = not self.notifications
    message = "on" if (self.notifications) else "off"
    toaster.show_toast("pingkit",f"notifications: {message}",icon_path='')

  def minimize(self):
    window.minimize()

  def fullscreen(self):
    window.toggle_fullscreen()

  def close(self):
    window.destroy()

  def reload(self):
    os.startfile(sys.argv[0])
    self.close()

#!FLAG-HTML

if __name__ == '__main__':
  api = Api()
  toaster = ToastNotifier()
  window = webview.create_window("{settings.app_name}", html=html, js_api=api, width={settings.app_proportions[0]}, height={settings.app_proportions[1]}, confirm_close={settings.app_confirm_close}, frameless={settings.app_frameless}, fullscreen={settings.app_fullscreen}, resizable={settings.app_resizable})
  window.events.closed += on_closed
  window.events.closing += on_closing
  window.events.shown += on_shown
  window.events.loaded += on_loaded
  webview.start(gui="{settings.app_web_engine}", debug={settings.app_allow_inspect})