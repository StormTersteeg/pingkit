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

function fetchSite(site) {
  return {
    ping: 30,
    avg_ping: 35,
    changes: 0,
    size: 2581,
    status: 200
  }
}

function fetchSites() {
  var string_html = ""
  var index = 0

  sites.forEach(site => {
    var result = fetchSite(site.url)
    var status_colour = ""

    switch(result.status) {
      case "200": status_colour = "success"; break
      case "201": status_colour = "success"; break
      case "400": status_colour = "danger"; break
      case "500": status_colour = "warning"; break
    }

    string_html += `
      <div id="request-${index}" class="row text-white">
        <div class="col-1"><colourblock style="background:${site.colour}"></colourblock></div>
        <div class="col-3">${site.url}</div>
        <div class="col-1">${result.ping}ms</div>
        <div class="col-2">${result.avg_ping}ms</div>
        <div class="col-1">${result.changes}</div>
        <div class="col-1">${result.size}</div>
        <div class="col-1"><span class="text-${status_colour}">${result.status}</div>
        <div class="col-1"></div>
      </div>
    `
    index++
  });

  document.getElementById("request-list").innerHTML = string_html
}

function addSite() {
  sites.push({
    url: new_site,
    colour: new_site_colour
  })
  fetchSites()

  $('#addSiteModal').modal('hide')

  document.getElementById("new-site-input").value = ""
  document.getElementById("new-site-colour-input").value = ""
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
    myInterval = setInterval(timerTick, timer_speed)
  } else {
    document.getElementById("timer-button").innerHTML = '<span class="material-icons">schedule</span>'
    document.getElementById("timer-button").classList.add("border-info")
    document.getElementById("timer-button").classList.remove("border-success")
    clearInterval(myInterval)
  }
}