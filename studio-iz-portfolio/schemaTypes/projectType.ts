import {defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'order', type: 'number', description: 'Lower number shows first'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'detail', title: 'Detail / tech line', type: 'text', rows: 3}),
    defineField({name: 'impact', type: 'string', description: 'Short headline impact'}),
    defineField({name: 'award', type: 'string', description: 'Award badge text (optional)'}),
    defineField({name: 'liveUrl', title: 'Live demo URL', type: 'url'}),
    defineField({name: 'codeUrl', title: 'GitHub URL', type: 'url'}),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({name: 'logo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'accentColor', type: 'string', description: 'Card accent hex, e.g. #E3A857'}),
    defineField({
      name: 'videoPath',
      title: 'Demo video path',
      type: 'string',
      description: 'Path in the site, e.g. /textures/project/niagamap-project.mp4',
    }),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'impact', media: 'logo'}},
})
