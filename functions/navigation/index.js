const slsp = require('sls-promise')
const fetch = require('isomorphic-unfetch')

exports.handler = slsp(() => {
  return fetch('https://www.jcrew.com/data/v1/us/navigation')
    .then(r => r.json())
    .then(data => {
      return data.nav
        .filter(navItem => {
          return Number(navItem.priority) !== -1
        })
        .map(parsers.NavigationCategory)
        .sort((a, b) => a.priority - b.priority)
    })
})

const parsers = {
  NavigationItem: data => ({
    id: data.id || data.url || data.label || '',
    label: data.label,
    shortLabel: data.mobileLabel,
    priority: Number(data.priority),
    url: data.url,
    isGift: /gift/i.test(data.label || '')
  }),
  NavigationCategory: data => Object.assign(parsers.NavigationItem(data), {
    subcategories: (data.navGroups || data.saleGroups || []).map(parsers.NavigationSubcategory)
  }),
  NavigationSubcategory: data => ({
    label: data.label,
    items: (data.navItems || []).map(parsers.NavigationItem)
  })
}
