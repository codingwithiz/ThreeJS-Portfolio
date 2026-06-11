import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({name: 'date', type: 'datetime', initialValue: () => new Date().toISOString()}),
    defineField({name: 'excerpt', type: 'text', rows: 3}),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({name: 'coverImage', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'body',
      title: 'Body (Markdown)',
      type: 'text',
      rows: 24,
      description: 'Markdown supported — headings, lists, code blocks, links, blockquotes.',
    }),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'date', media: 'coverImage'}},
})
