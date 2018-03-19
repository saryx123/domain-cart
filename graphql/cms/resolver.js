const config = require('../../config')
const join = require('url-join')
const fetch = require('isomorphic-unfetch')

module.exports = {
  Query: {
    cmsLayout (root, args) {
      const urlJoinArgs = [
        config.hippo.base,
        config.hippo.context,
        args.isPreview && '_cmsinternal',
        'resourceapi',
        args.layoutName
      ].filter(Boolean)

      return fetch(join(...urlJoinArgs))
        .then(r => r.json())
        .then(parsers.Layout)
    }
  }
}

const parsers = {
  Layout: layout => {
    return {
      // NOTE(ajoslin): GraphQL doesn't allow key/value maps.
      // We just send down an array of documents instead of <Id,Document> map.
      documents: Object.keys(layout.documents).map(id => {
        return parsers.DocumentContainer(layout.documents[id])
      }),
      containers: layout.containers.map(container => {
        return {
          name: container.name,
          id: container.id,
          superType: container.superType,
          label: container.label,
          components: (container.components || []).map(component => {
            return {
              name: component.name,
              id: component.id,
              type: component.type,
              superType: component.superType,
              cmsData: component.cmsData,
              attributes: component.attributes,
              parameters: component.parameters
            }
          })
        }
      })
    }
  },
  DocumentContainer: data => ({
    id: data.document && data.document.id,
    cmsData: data.cmsData,
    link: data.link,
    document: parsers.Document(data.document)
  }),
  Document: document => ({
    id: document.id,
    name: document.name,
    displayName: document.displayName,
    title: document.title,
    link: document.link,
    content: document.content,
    image: !document.image
      ? undefined
      : {
        id: document.image.id,
        fileName: document.image.fileName,
        description: document.image.description,
        src: document.image.handlePath
          ? join(
            config.hippo.base,
            config.hippo.context,
            config.hippo.binaries,
            document.image.handlePath
          )
          : undefined
      }
  })
}
