import * as d3 from 'd3'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 450 - margin.top - margin.bottom
let width = 350 - margin.left - margin.right

var container = d3.select('#chart-9')

let angleScale = d3.scaleBand().range([0, Math.PI * 2])

let radius = 125

let radiusScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, radius])

let line = d3
  .radialLine()
  .angle(d => angleScale(d.name))
  .radius(d => radiusScale(d.value) + 60)

let max = 1

d3.csv(require('./data/outB1.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  container
    .selectAll('svg')
    .data(datapoints)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)
    .each(function(d) {
      let svg = d3.select(this)
      let holder = svg

      let player = d
      let maskId = player.Name.replace(' ', '-')

      let customDatapoints = [
        {
          name: 'History',
          value: player.Device_and_App_History *10
        },
        { name: 'Contacts', value: player.Contacts *10 },
        { name: 'Identity', value: player.Identity *10},
        { name: 'Location', value: player.Location *10},
        { name: 'Phone', value: player.Phone *10},
        { name: 'PMF', value: player.Photos_Media_Files *10},
        { name: 'Storage', value: player.Storage *10},
        {name: 'Camera', value: player.Camera *10},
        {name: 'Microphone', value: player.Microphone *10},
        { name: 'Wi-Fi', value: player.Wi_Fi *10 },
        { name: 'DeviceID', value: player.DeviceID *10},
        { name: 'Wearable', value: player.Wearable *10},
        { name: 'Calendar', value: player.Calendar *10},
        { name: 'Other', value: player.Other *10},
        { name: 'SMS', value: player.SMS *10}
      ]

      let categories = customDatapoints.map(d => d.name)
      angleScale.domain(categories)

      var bands = [0.2, 0.4, 0.6, 0.8, 1]

      holder
        .selectAll('.band-circle')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('stroke', 'white')
        .attr('fill', (d, i) => {
          if (i % 2 === 0) {
            return '#e8e7e5'
          } else {
            return '#f6f6f6'
          }
        })
        .lower()

      holder
        .append('g')
        .attr('mask', `url(#${maskId})`)
        .attr('class', player.Color)
        .selectAll('.band-circle')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .lower()

      holder
        .selectAll('.category-title')
        .data(categories)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', 9)
        .attr('font-weight', 'bold')
        .text(d => d)
        .attr('x', 0)
        .attr('y', -radius)
        .attr('dy', -20)
        .attr('transform', d => {
          let degrees = (angleScale(d) / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .append('mask')
        .attr('id', maskId)
        .append('path')
        .datum(customDatapoints)
        .attr('d', line)
        .attr('fill', 'white')

      holder
        .append('text')
        .attr('font-size', 20)
        .attr('font-weight', 'bold')
        .text(player.Name)
        .attr('y', -radius)
        .attr('dy', -75)
        .attr('text-anchor', 'middle')

      holder
        .append('text')
        .attr('font-size', 12)
        .text(player.Seller)
        .attr('y', -radius)
        .attr('dy', -45)
        .attr('text-anchor', 'middle')
    })
}
