import {defineField, defineType} from 'sanity'

export const awardType = defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'order', type: 'number', description: 'Lower number shows first'}),
    defineField({name: 'issuer', type: 'string'}),
    defineField({name: 'date', type: 'string', description: 'e.g. Mar 2026'}),
    defineField({name: 'prize', type: 'string', description: 'e.g. RM 12,000'}),
    defineField({name: 'featured', type: 'boolean', initialValue: false, description: 'Show in the featured gallery'}),
    defineField({name: 'blurb', type: 'text', rows: 3}),
    defineField({name: 'image', title: 'Winning photo', type: 'image', options: {hotspot: true}}),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'issuer', media: 'image'}},
})
