import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HotelCard from '../HotelCard.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/about/:id', name: 'About', redirect: '' }]
})

describe('HotelCard.vue', () => {
  it('renders hotel details correctly', () => {
    const hotel = {
      id: 1,
      name: 'Hotel Test',
      address: '123 Test St',
      rooms: [
        { id: 1, name: 'Room 1', price: 100, capacity: 2 },
        { id: 2, name: 'Room 2', price: 200, capacity: 4 }
      ],
      location: 'Test Porto Alegre',
      stars: 4
    }

    const wrapper = mount(HotelCard, {
      global: {
        plugins: [router]
      },
      props: { hotel }
    })

    expect(wrapper.find('.card_container__title').text()).toContain('Hotel Test')
    expect(wrapper.find('.v-card-subtitle').text()).toContain('123 Test St')
    expect(wrapper.findAll('.v-list-item').length).toBe(2)
  })

  it('navigates to about page on button click', async () => {
    const hotel = {
      id: 1,
      name: 'Hotel Test',
      address: '123 Test St',
      rooms: [],
      stars: 4,
      location: 'Test   Porto Alegre'
    }

    const wrapper = mount(HotelCard, {
      global: {
        plugins: [router]
      },
      props: { hotel }
    })

    // Debug the rendered HTML to check for the button
    console.log(wrapper.html())

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(router.currentRoute.value.fullPath).toBe('/about/1')
  })
})
