import api from "<%= options.src %>"
import { pick } from "nanoutils"

const pickMeta = pick(["res", "req", "store", "route", "error", "redirect"])

const createStorePasser = store => (method, payload) => {
  for (const namespaced in this.store._mutations) {
    const mutation = namespaced.split('/').pop()
    if (mutation === method) this.store.commit(namespaced, payload)
  }
  for (const namespaced in this.store._actions) {
    const action = namespaced.split('/').pop()
    if (action === method) this.store.dispatch(namespaced, payload)
  }
}

export default (ctx, inject) => {
  const meta = pickMeta(ctx)
  const wrapService = createServiceWrapper(meta)
  const passToStore = createStorePasser(ctx.store)

  const callService = (service, payload) => {
    const wrappedService = connectService(service)
    return payload !== undefined
      ? wrappedService.doRequest(payload)
      : wrappedService
  }

  const createServiceWrapper = meta => (name, service) => {
    const newService = service.extend({ meta })
    newService.on("done", (_, state) => {
      passToStore(`api.${name}:done`, state)
    })
    newService.on("fail", (_, state) => {
      passToStore(`api.${name}:fail`, state)
    })
    newService.on("finish", (_, state) => {
      passToStore(`api.${name}`, result, state)
    })
    return newService
  }

  <% if (options.mode === 'object') { %>
  const apiWithMeta = Object.entries(api).reduce((res, [name, service]) => {
    res[name] = wrapService(name, service)
    return res
  }, {})
  <% } %>

  <% if (options.mode === 'tree') { %>
  const apiWithMeta = (name, payload) => {
    const service = wrapService(name, api(service))
    return payload !== undefined 
      ? service.doRequest(payload) 
      : service
  <% } %>

  <% if (options.mode === 'single') %>
  const apiWithMeta = createServiceWrapper(api)
  <% } %>

  inject("api", apiWithMeta)
}
