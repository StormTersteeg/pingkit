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

function updateChart(index) {
  data.datasets[index].data = sites[index].size_data
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
      }
      sites[index].last_size = site.size

      updateChart(index)

      document.getElementById("request-list").innerHTML += `
        <div id="request-${index}" class="row text-white mb-1">
          <div class="col-1"><colourblock style="background:${sites[index].colour}"></colourblock></div>
          <div class="col-3 text-truncate">${sites[index].url.replace('https://','').replace('http://', '').replace('www.', '')}</div>
          <div class="col-1">${site.ping}ms</div>
          <div class="col-2">${average_ping}ms</div>
          <div class="col-1">${sites[index].changes}</div>
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
    size_data: [],
    last_size: -1,
    changes: -1
  })
  fetchSites()

  data.datasets.push({
    label: new_site.replace('https://','').replace('http://', '').replace('www.', ''),
    data: [],
    borderColor: [new_site_colour],
  })
  sizeChart.update()

  $('#addSiteModal').modal('hide')

  document.getElementById("new-site-input").value = ""
  document.getElementById("new-site-colour-input").value = Math.floor(Math.random()*16777215).toString(16)
}

function removeSite(el, index) {
  el.parentElement.parentElement.remove()
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