$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

function navigate(page) {
  var pages = document.getElementsByClassName('glide-page')
  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.add('d-none')
    pages[i].classList.remove('d-block')
  }

  document.getElementById('glide-page-' + page).classList.remove('d-none')
  document.getElementById('glide-page-' + page).classList.add('d-block')

  current_page = page
}

function shortURL(url) {
  return url.replace('https://','').replace('http://', '').replace('www.', '').split('/')[0]
}

function updateChart(index) {
  data.datasets[index].data = sites[index].size_data.slice(-60)
}

function fetchSites() {
  var index = 0

  pywebview.api.fetchSites(sites).then(function(response) {
    document.getElementById("request-list").innerHTML = ""
    response.forEach(site => {
      var status_colour = "info"

      if (site.status>=200) {status_colour = "success"}
      if (site.status>=400) {status_colour = "danger"}
      if (site.status>=500) {status_colour = "warning"}

      sites[index].ping_data.push(site.ping)
      sites[index].size_data.push(site.size)
      var average_ping = parseInt(sites[index].ping_data.reduce((t, i) => t + i, 0) / sites[index].ping_data.length)
      if (sites[index].last_size!=site.size) {
        sites[index].changes++
        if (notifications && sites[index].last_size!=-1) {
          pywebview.api.doNotification(`${shortURL(sites[index].url)} size changed (${sites[index].last_size}->${site.size})`)
          eventLog(`${sites[index].url} size changed (${sites[index].last_size}->${site.size})`)
        }
      }
      sites[index].last_size = site.size

      updateChart(index)

      document.getElementById("request-list").innerHTML += `
        <div id="request-${index}" class="row text-white mt-1">
          <div class="col-1"><colourblock style="background:${sites[index].colour}"></colourblock></div>
          <div class="col-3 text-truncate">${shortURL(sites[index].url)}</div>
          <div class="col-1">${site.ping}ms</div>
          <div class="col-2">${average_ping}ms</div>
          <div class="col-2">${sites[index].changes}</div>
          <div class="col-1">${site.size}</div>
          <div class="col-1"><span class="text-${status_colour}">${site.status}</div>
          <div class="col-1"><span class="material-icons pointer text-white-50" onclick="removeSite(this, ${index})">highlight_off</span></div>
        </div>
      `
      index++
    });
    sizeChart.update()
  })
}

function addSite() {
  sites.push({
    url: new_site,
    colour: new_site_colour,
    ping_data: [],
    size_data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    last_size: -1,
    changes: -1
  })

  document.getElementById("request-list").innerHTML += `
  <div class="row text-white mt-1">
    <div class="col-1"><colourblock style="background:${new_site_colour}"></colourblock></div>
    <div class="col-3 text-truncate">${shortURL(new_site)}</div>
    <div class="col-1"></div>
    <div class="col-2"></div>
    <div class="col-2"></div>
    <div class="col-1"></div>
    <div class="col-1">???</div>
    <div class="col-1"><span class="material-icons pointer text-white-50" onclick="removeSite(this, ${sites.length-1})">highlight_off</span></div>
  </div>
`

  data.datasets.push({
    label: shortURL(new_site),
    data: [],
    borderColor: [new_site_colour],
  })
  sizeChart.update()

  $('#addSiteModal').modal('hide')

  document.getElementById("new-site-input").value = ""
  eventLog(`${shortURL(new_site)} was added`)
}

function removeSite(el, index) {
  eventLog(`${sites[index].url} was deleted`)
  el.parentElement.parentElement.remove()
  sites.splice(index, 1)
  data.datasets.splice(index, 1)
  sizeChart.update()
}

function timerTick() {
  fetchSites()
}

function toggleTimer() {
  interval = !interval
  
  if (interval) {
    document.getElementById("timer-button").innerHTML = '<span class="material-icons rotate">autorenew</span>'
    document.getElementById("timer-button").classList.remove("border-info")
    document.getElementById("timer-button").classList.add("border-success")
    timerTick()
    myInterval = setInterval(timerTick, timer_speed*1000)
  } else {
    document.getElementById("timer-button").innerHTML = '<span class="material-icons">schedule</span>'
    document.getElementById("timer-button").classList.add("border-info")
    document.getElementById("timer-button").classList.remove("border-success")
    clearInterval(myInterval)
  }
}

function toggleNotifications() {
  notifications = !notifications
  
  if (notifications) {
    document.getElementById("notification-button").innerHTML = '<span class="material-icons">notifications</span>'
  } else {
    document.getElementById("notification-button").innerHTML = '<span class="material-icons">notifications_off</span>'
  }

  pywebview.api.toggleNotifications()
}

function getTimeNow() {
  return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
}

function eventLog(string) {
  document.getElementById('event-log').innerHTML = `
  <div class='row'>
    <div class='col-12'>
      <span class='text-white-50 mr-2'>${getTimeNow()}</span><span>${string}</span>
    </div>
  </div>` + document.getElementById('event-log').innerHTML
}