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

function fetchSites() {
  document.getElementById("request-list").innerHTML = ""
  var index = 0

  sites.forEach(site => {
    pywebview.api.fetchSite(site.url).then(function(response) {
      var status_colour = ""
  
      switch(response.status) {
        case "200": status_colour = "success"; break
        case "201": status_colour = "success"; break
        case "400": status_colour = "danger"; break
        case "500": status_colour = "warning"; break
      }
  
      document.getElementById("request-list").innerHTML += `
        <div id="request-${index}" class="row text-white mb-1">
          <div class="col-1"><colourblock style="background:${site.colour}"></colourblock></div>
          <div class="col-3">${site.url.replace('https://','').replace('http://', '').replace('www.', '')}</div>
          <div class="col-1">${response.ping}ms</div>
          <div class="col-2">0ms</div>
          <div class="col-1">0</div>
          <div class="col-1">${response.size}</div>
          <div class="col-1"><span class="text-${status_colour}">${response.status}</div>
          <div class="col-1"><span class="material-icons pointer text-white-50" onclick="removeSite(${index})">highlight_off</span></div>
        </div>
      `
      index++
    })
  });
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

function removeSite(index) {
  sites.splice(index, 1)
  fetchSites()
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